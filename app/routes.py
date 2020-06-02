from flask import abort, render_template, request, jsonify

from app import app, db
from app.models import Song


@app.route('/')
def index():
    return render_template("index.html")


# @app.route('/about')
# def about():
#     return render_template("about.html")


# @app.route('/admin')
# def admin():
#    return render_template("admin/index.html")


# @app.route('/music')
# def music():
#     return render_template("music.html")


# @app.route('/store')
# def store():
#    return render_template("store.html")


# @app.route('/blog')
# def blog():
#     return render_template("blog.html")


@app.route("/plays", methods=['GET', 'POST'])
def plays(**kwargs):
    if request.method == 'POST':
        song_id = request.args.get('song_id')
        song = Song.query.filter_by(id=int(song_id)).first()
        song.incr_plays()
        db.session.add(song)
        try:
            db.session.commit()
            app.logger.info(f"Plays incremented successfully for song id {song_id}")
            return jsonify({
                "message": "success",
                "id": song.id,
                "name": song.name,
                "plays": song.plays,
            })
        except Exception as e:
            app.logger.error(f"An error occurred: {e}")
            db.session.rollback()
            app.logger.info("Rollback performed successfully")
            return jsonify({
                "message": "Error. Rollback applied successfully.",
                "id": song.id,
                "name": song.name,
            })
            
    elif request.method == 'GET':
        song_name = kwargs.get('song_name', None)
        song = Song.query.filter_by(name=song_name).first()
        return jsonify({
            "type": "GET",
            "result": "success",
            "name": song_name,
            "plays": song.plays,
        })


@app.route("/pauses", methods=['GET', 'POST'])
def pauses():
    if request.method == 'POST':
        song_id = request.args.get('song_id')
        song = Song.query.filter_by(id=int(song_id)).first()
        song.incr_pauses()
        db.session.add(song)
        try:
            db.session.commit()
            app.logger.info(f"Pauses incremented successfully for song id {song_id}")
            return jsonify({
                "message": "success",
                "id": song.id,
                "name": song.name,
                "pauses": song.pauses,
            })
        except Exception as e:
            app.logger.error(f"An error occurred: {e}")
            db.session.rollback()
            app.logger.info("Rollback performed successfully")
            return jsonify({
                "message": "Error. Rollback applied successfully.",
                "id": song.id,
                "name": song.name,
            })
            
    elif request.method == 'GET':
        song_name = kwargs.get('song_name', None)
        song = Song.query.filter_by(name=song_name).first()
        return jsonify({
            "type": "GET",
            "result": "success",
            "name": song_name,
            "pauses": song.pauses,
        })


@app.route("/info", methods=['GET'])
def info():
    song_id = request.args.get("song_id")
    song = Song.query.filter_by(id=int(song_id)).first()
    return jsonify({
        "id": song.id,
        "name": song.name,
        "artist": song.artist,
        "album": song.album,
        "info": song.info,
        "plays": song.plays - song.pauses + 1,
    })
