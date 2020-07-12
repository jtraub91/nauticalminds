import os
import time

from flask import abort, render_template, request, jsonify, send_from_directory, redirect
from flask_login import login_user, logout_user, current_user, login_required
from sqlalchemy.exc import IntegrityError

from app import app, db, csrf
from app.models import Song, User, Comment

@app.route('/')
def index():
    return render_template(
        "index.html", 
        logged_in=current_user.is_authenticated, 
        user_email=current_user.email if current_user.is_authenticated else None
    )


@app.route('/join', methods=['GET', 'POST'])
@csrf.exempt
def join():
    if request.method == 'POST':
        if request.is_json:
            data = request.json
        else:
            data = request.form
        
        new_user = User()
        new_user.email = data['email']
        new_user.set_password(data['password'])
        try:
            db.session.add(new_user)
            db.session.commit()
        except IntegrityError as e:
            app.logger.error("integrity error: %s", e)
            db.session.rollback()
            msg = {
                'status': 'fail',
                'message': 'User account already exists',
                'email': new_user.email
            }
            return jsonify(msg) if request.is_json else render_template("join.html", message=msg)
        except Exception as e:
            app.logger.error("broad except: %s", e)
            db.session.rollback()
            return abort(500)
        msg = {
            'status': 'success',
            'message': f'User created successfully. An email confirmation has been sent to {new_user.email}',
            'email': new_user.email,
        }
        return jsonify(msg) if request.is_json else render_template("join.html", message=msg)
    else:
        return render_template("join.html")


@app.route('/login', methods=['GET', 'POST'])
@csrf.exempt
def login(): 
    if request.method == "POST":
        if current_user.is_authenticated:
            return redirect('/')
        if request.is_json:
            email = request.json['email']
            password = request.json['password']
        else:
            email = request.form['email']
            password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user:
            if user.check_password(password):
                if login_user(user):
                    msg = {
                        "status": "success",
                        "message": "Login successful",
                        "email": user.email,
                    }
                    return jsonify(msg) if request.is_json else redirect('/')
                else:
                    msg = {
                        'status': 'fail',
                        'message': 'User account is disabled.',
                        'email': user.email
                    }
                    return jsonify(msg) if request.is_json else render_template('login.html', message=msg)
            else:
                msg = {
                    'status': 'fail',
                    'message': 'Login failed. <a href="/forgotpassword">Reset password?</a>',
                    'email': user.email
                }
                return jsonify(msg) if request.is_json else render_template("login.html", message=msg)
        else:
            msg = {
                'status': 'fail',
                'message': 'User does not exist.',
                'email': email
            }
            return jsonify(msg) if request.is_json else render_template("login.html", message=msg)
    else:
        return render_template("login.html")


@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect("/")


@app.route('/about')
def about():
    return render_template("about.html")


# @app.route('/admin')
# def admin():
#    return render_template("admin/index.html")


@app.route('/music/<album>/<filename>')
@login_required
def music(album, filename):
    filename_map = {
        "gotta_let_you_know.mp3": "Nautical Minds - Gotta Let You Know.mp3",
        "aint_gotta_care.mp3": "Nautical Minds - Ain't Gotta Care.mp3",
        "funk1.mp3": "Nautical Minds - Funk 1 (ft. B.I.G. Jay).mp3",
        "spacy_stacy.mp3": "Nautical Minds - Spacy Stacy.mp3",
        "sidestreet_robbery.mp3": "Nautical Minds - A Side Street Robbery.mp3",
        "off_the_clock.mp3": "Nautical Minds - Off The Clock.mp3"
    }
    download = request.args.get("download")
    return send_from_directory(
        os.path.join(app.config['MUSIC_DIR'], album), 
        filename, 
        as_attachment=True if download else False,
        attachment_filename=filename_map[filename]
    )


@app.route('/video/<album>/<filename>')
@login_required
def video(album, filename):
    return send_from_directory(
        os.path.join(app.config['VIDEO_DIR'], album), 
        filename
    )

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


@app.route("/downloads", methods=['GET', 'POST'])
def downloads():
    if request.method == 'POST':
        song_id = request.args.get('song_id')
        song = Song.query.filter_by(id=int(song_id)).first()
        song.incr_downloads()
        db.session.add(song)
        try:
            db.session.commit()
            app.logger.info(f"Downloads incremented successfully for song id {song_id}")
            return jsonify({
                "message": "success",
                "id": song.id,
                "name": song.name,
                "downloads": song.downloads,
            })
        except Exception as e:
            app.logger.error(f"An error occurred: {e}")
            db.session.rollback()
            app.logger.info("Rollback performed successfully")
            return jsonify({
                "message": "DB Error. Rollback applied",
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
            "downloads": song.downloads,
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
        "plays": song.plays,
        "downloads": song.downloads
    })


@app.route('/comment', methods=['POST'])
@login_required
def comment():
    comment = Comment()
    comment.user_id = current_user.id
    comment.comment_text = request.json['comment']
    
    db.session.add(comment)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Exception occurred: {e}")
        return jsonify({
            "status": "error",
            "message": "An internal error has occurred. An admin has been notified. Please try again."
        })

    return jsonify({
        "status": "success",
        "message": "Comment sent successfully.",
    })
