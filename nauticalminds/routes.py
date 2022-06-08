import json
import os
from subprocess import PIPE
from subprocess import Popen

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
from nauticalminds.utils import token_required

# import jwt

# from eth_account.messages import encode_defunct

# from nauticalminds import db_session
# from nauticalminds import web3
# from nauticalminds.models import NauticalMindsEp
# from nauticalminds.models import Song
# from nauticalminds.models import User


@app.route("/")
def index():
    return render_template("index.html")


# @app.route("/connect", methods=["POST"])
# def connect():
#     data = request.get_json()
#     eth_address = data.get("ethAddress")
#     if not eth_address:
#         return jsonify({"error": "ethAddress unspecified"})
#     eth_address = eth_address.split("0x")[-1]  # todo: enforce case in db
#     user = db_session.query(User).filter_by(eth_address=eth_address).first()
#     if not user:
#         user = User()
#         user.eth_address = eth_address
#         nonce = user.set_new_nonce()
#         db_session.add(user)
#         try:
#             db_session.commit()
#         except Exception as e:
#             app.logger.error(f"User creation failed for address {eth_address} - {e}")
#             return jsonify({"message": "Account creation failed."})
#         return jsonify(
#             {
#                 "ethAddress": eth_address,
#                 "message": "User account created.",
#                 "sigRequest": "Sign this message to prove ownership of your account. "
#                 + f"This won't cost you any ether.\n\nNonce: {nonce}",
#             }
#         )
#     nonce = user.set_new_nonce()
#     db_session.add(user)
#     try:
#         db_session.commit()
#     except Exception as e:
#         app.logger.error(f"Failed to set new nonce for {user} - {e}")
#         return jsonify({"message": "Internal server error"})
#     return jsonify(
#         {
#             "ethAddress": eth_address,
#             "message": "User account exists.",
#             "sigRequest": "Sign this message to prove ownership of your account. "
#             + f"This won't cost you any ether.\n\nNonce: {nonce}",
#         }
#     )


# @app.route("/sig", methods=["POST"])
# def sig():
#     """
#     Respond to signature request response with a jwt token

#     Request args (encoding application/json):
#         ethAddress

#     Returns:
#         Upon successful response, return a valid jwt auth token
#     """
#     if not request.is_json:
#         return abort(400)
#     data = request.get_json()
#     eth_address = data.get("ethAddress")
#     if not eth_address:
#         return jsonify({"error": "ethAddress unspecified"})
#     eth_address = eth_address.split("0x")[-1]

#     signature = data.get("signature")
#     if not signature:
#         return jsonify({"error": "signature empty"})

#     user = db_session.query(User).filter_by(eth_address=eth_address).first()
#     if not user:
#         return abort(401)

#     # verify sig
#     message = (
#         "Sign this message to prove ownership of your account. "
#         + f"This won't cost you any ether.\n\nNonce: {user.nonce}"
#     )
#     message_hash = encode_defunct(text=message)
#     recovered_address = web3.eth.account.recover_message(
#         message_hash, signature=signature
#     )
#     if eth_address.lower() != recovered_address.split("0x")[-1].lower():
#         return jsonify({"error": "recovered address does not match"})

#     # return token
#     payload = {
#         "ethAddress": eth_address,
#         # "exp":  # todo
#     }
#     token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
#     return jsonify(
#         {
#             "token": token,
#         }
#     )


# def stream_gen(filepath, chunk_size=1024, bitrate=320000):
#     filename = os.path.split(filepath)[-1]
#     song = db_session.query(Song).filter_by(filename=filename).first()
#     chunks = 1
#     with open(filepath, "rb") as music_file:
#         data = music_file.read(chunk_size)
#         while data:
#             yield data
#             seconds = chunks * chunk_size * 8 / bitrate
#             chunks += 1
#             if seconds > 1:
#                 song.total_seconds_streamed += seconds
#                 chunks = 1
#                 try:
#                     db_session.commit()
#                     app.logger.debug(seconds)
#                 except Exception as e:
#                     app.logger.error(
#                         f"Failed to add {seconds}s to total seconds streamed for {song} - {e}"
#                     )
#             data = music_file.read(chunk_size)


# @app.route("/stream/nautical_minds/<album>/<filename>")
# # @token_required
# def stream(album, filename):
#     song = db_session.query(Song).filter_by(filename=filename).first()
#     song.streams += 1
#     db_session.commit()
#     filepath = os.path.join(app.config["MUSIC_DIR"], "nautical_minds", album, filename)
#     ext = os.path.splitext(filepath)[-1].split(".")[-1]
#     return Response(stream_gen(filepath), mimetype=f"audio/{ext}")


# @app.route("/download")
# @token_required
# def download():
#     nmep = db_session.query(NauticalMindsEp).first()
#     nmep.downloads += 1
#     try:
#         db_session.commit()
#     except Exception as e:
#         app.logger.error(f"Failed to increment downloads for {nmep} - {e}")
#     return send_from_directory(
#         os.path.join(app.config["MUSIC_DIR"], "nautical_minds", "nautical_minds_ep"),
#         "NauticalMindsEP.zip",
#         as_attachment=True,
#     )


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
