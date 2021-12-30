import os

from flask import abort, render_template, request, jsonify, send_from_directory, redirect, Response
from app import app


@app.route('/')
def index():
    return render_template("index.html")


@app.route("/jwt")
def jwt():
    return jsonify({})


def stream_gen(filepath, start_byte=0, chunk_size=8192):
    WAV_HEADER_SIZE = 44
    music_file = open(filepath, 'rb')
    first_chunk = music_file.read(WAV_HEADER_SIZE)
    yield first_chunk
    music_file.seek(start_byte + WAV_HEADER_SIZE)
    while True:        
        data = music_file.read(chunk_size)
        if not data:
            music_file.close()
            break
        yield data


@app.route("/stream/<album>/<filename>")
def stream(album, filename):
    filepath = os.path.join(app.config['MUSIC_DIR'], album, filename)
    ext = os.path.splitext(filepath)[-1].split(".")[-1]
    return Response(stream_gen(filepath), mimetype=f"audio/{ext}")


@app.route('/music/<album>/<filename>')
def music(album, filename):
    song, ext = os.path.splitext(filename)
    filename_map = {
        "gotta_let_you_know": "Nautical Minds - Gotta Let You Know",
        "aint_gotta_care": "Nautical Minds - Ain't Gotta Care",
        "funk1": "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
        "spacy_stacy": "Nautical Minds - Spacy Stacy",
        "sidestreet_robbery": "Nautical Minds - A Side Street Robbery",
        "off_the_clock": "Nautical Minds - Off The Clock"
    }
    download = request.args.get("download")
    return send_from_directory(
        os.path.join(app.config['MUSIC_DIR'], album), 
        filename, 
        as_attachment=True if download else False,
        attachment_filename=filename_map[song] + ext
    )