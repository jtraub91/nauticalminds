import os
import time

from flask import abort, render_template, request, jsonify
from sqlalchemy.exc import IntegrityError

from app import app, db
from app.models import Song, User


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/onboard', methods=['POST'])
def onboard():
    if request.is_json:
        data = request.json
        new_user = User()
        new_user.email = data['email']
        new_user.set_password(data['password'])
        try:
            db.session.add(new_user)
            db.session.commit()
        except IntegrityError as e:
            app.logger.error("integrity error: %s", e)
            db.session.rollback()
            return jsonify({
                'status': 'fail',
                'message': 'User account already exists. <a href="/forgotpassword">Forgot Password?</a>',
                'email': new_user.email
            })
        except Exception as e:
            app.logger.error("broad except: %s", e)
            db.session.rollback()
            return abort(500)
        return jsonify({
            'status': 'success',
            'message': f'User created successfully. An email confirmation has been sent to {new_user.email}',
            'email': new_user.email,
        })
    else:
        return abort(400)


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
    # todo: why don't i need csrf header on this
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


@app.route('/comment', methods=['POST'])
def comment():
    timestamp = int(time.time() * 1000)
    filename = os.path.join(app.config['COMMENTS_DIR'], str(timestamp) + ".txt")

    with open(filename, 'w') as file_:
        file_.write(request.json['comment'])

    return jsonify({
        'message': 'Comment successfully sent.'
    })
