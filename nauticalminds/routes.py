import json
import os
from subprocess import PIPE
from subprocess import Popen

import jwt
from flask import abort
from flask import json
from flask import jsonify
from flask import make_response
from flask import redirect
from flask import render_template
from flask import request
from flask import Response
from flask import send_from_directory

from nauticalminds import app
from nauticalminds import db_session
from nauticalminds.models import User


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/connect", methods=["POST"])
def connect():
    data = request.get_json()
    print(data)
    eth_address = data.get("ethAddress")
    if not eth_address:
        return jsonify({"error": "ethAddress unspecified"})
    eth_address = eth_address.split("0x")[-1]
    user = db_session.query(User).filter_by(eth_address=eth_address).first()
    if not user:
        user = User()
        user.eth_address = eth_address
        db_session.add(user)
        db_session.commit()
        return jsonify(
            {
                "ethAddress": eth_address,
                "message": "User account created.",
            }
        )
    return jsonify(
        {
            "ethAddress": eth_address,
            "message": "User account exists.",
        }
    )


@app.route("/sig", methods=["POST"])
def sig():
    """
    Respond to signature request response with a jwt token

    Request args (encoding application/json):
        ethAddress

    Returns:
        Upon successful response, return a valid jwt auth token
    """
    if not request.is_json:
        return abort(400)
    data = request.get_json()
    eth_address = data.get("ethAddress")
    if not eth_address:
        return jsonify({"error": "ethAddress unspecified"})
    signed_data = data.get("signedData")
    if not signed_data:
        return jsonify({"error": "signedData empty"})
    # verify sig

    return jsonify({})


def stream_gen(filepath, start_byte=0, chunk_size=1024):
    music_file = open(filepath, "rb")
    music_file.seek(start_byte)
    while True:
        data = music_file.read(chunk_size)
        if not data:
            music_file.close()
            break
        yield data


@app.route("/stream/<album>/<filename>")
def stream(album, filename):
    filepath = os.path.join(app.config["MUSIC_DIR"], album, filename)
    ext = os.path.splitext(filepath)[-1].split(".")[-1]
    return Response(stream_gen(filepath), mimetype=f"audio/{ext}")


@app.route("/music/nautical_minds/<album>/<filename>")
def music(album, filename):
    print(request.headers)
    song, ext = os.path.splitext(filename)
    filename_map = {
        "gotta_let_you_know": "Nautical Minds - Gotta Let You Know",
        "aint_gotta_care": "Nautical Minds - Ain't Gotta Care",
        "funk1": "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
        "spacy_stacy": "Nautical Minds - Spacy Stacy",
        "side_street_robbery": "Nautical Minds - Side Street Robbery",
        "off_the_clock": "Nautical Minds - Off The Clock",
    }
    download = request.args.get("download")
    return send_from_directory(
        os.path.join(app.config["MUSIC_DIR"], "nautical_minds", album),
        filename,
        as_attachment=True if download else False,
        attachment_filename=filename_map[song] + ext,
    )


@app.route("/meta")
def meta():
    with Popen(
        f"ipfs cat {app.config['META_URI'].split('ipfs://')[1]}".split(), stdout=PIPE
    ) as proc:
        stdout, stderr = proc.communicate()
    if not stderr:
        return jsonify(json.loads(stdout.decode("utf-8")))
    return jsonify({"error": stderr.decode("utf-8")})


@app.route("/ipfs/<cid>")
def ipfs(cid):
    """
    Returns file contents from ipfs

    Request args:
        file_type: [json, jpeg, mp3]
    """
    type_map = {"json": "application/json", "jpeg": "image/jpeg", "mp3": "audio/mpeg"}
    file_type = request.args.get("file_type", "json")

    if file_type not in type_map.keys():
        return abort(403)
    mime_type = type_map[file_type]
    if cid not in app.config["PINNED_CIDS"]:
        return abort(401)
    with Popen(f"ipfs cat {cid}".split(), stdout=PIPE) as proc:
        stdout, stderr = proc.communicate()
    if not stderr:
        if file_type == "json":
            stdout = stdout.decode("utf-8")
            return jsonify(json.loads(stdout))
        return Response(stdout, mimetype=mime_type)
    return jsonify({"error": stderr.decode("utf-8")})
