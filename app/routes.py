import os
import time
import wave

from flask import abort, render_template, request, jsonify, send_from_directory, redirect, Response
from flask_login import login_user, logout_user, current_user, login_required
from sqlalchemy.exc import IntegrityError


from app import app, db, csrf
from app.models import Song, User, Comment
from app.forms import LoginForm

import stripe
stripe.api_key = "sk_test_51EoBXvEFT5TnYZhd26E9dh5s19bji5zPNgteszZz1MZVqvdtbwqz4wekvoxKVGU8nk1308uESizt85TBTVh8tbR900MmxgV39Y"

@app.route('/')
def index():
    return render_template(
        "index.html", 
        logged_in=current_user.is_authenticated, 
        user_email=current_user.email if current_user.is_authenticated else None
    )


@app.route('/join', methods=['GET'])
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
            return jsonify(msg) if request.is_json else render_template("join.html", message=[msg])
        except Exception as e:
            app.logger.error("broad except: %s", e)
            db.session.rollback()
            return abort(500)
        msg = {
            'status': 'success',
            'message': f'User created successfully. An email confirmation has been sent to {new_user.email}',
            'email': new_user.email,
        }
        return jsonify(msg) if request.is_json else render_template("join.html", message=[msg])
    else:
        return render_template("join.html")


@app.route('/login', methods=['GET', 'POST'])
@csrf.exempt
def login(): 
    if request.method == "POST":
        form = LoginForm()
        if not form.validate_on_submit():
            messages = []
            for field in form.errors:
                messages.append({
                    "message": form.errors[field][0],
                    "status": "fail",
                })
            return render_template("login.html", message=messages)
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
                        "email": user.email
                    }
                    return jsonify(msg) if request.is_json else redirect('/')
                else:
                    msg = {
                        'status': 'fail',
                        'message': 'User account is disabled.',
                        'email': user.email
                    }
                    return jsonify(msg) if request.is_json else render_template('login.html', message=[msg])
            else:
                msg = {
                    'status': 'fail',
                    'message': 'Password does not match.',
                    'email': user.email
                }
                return jsonify(msg) if request.is_json else render_template("login.html", message=[msg])
        else:
            msg = {
                'status': 'fail',
                'message': 'User does not exist.',
                'email': email
            }
            return jsonify(msg) if request.is_json else render_template("login.html", message=[msg])
    else:
        return redirect('/') if current_user.is_authenticated else render_template("login.html")


@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect("/")


@app.route('/about')
def about():
    return render_template("about.html", logged_in=current_user.is_authenticated, user_email=current_user.email if current_user.is_authenticated else None)


# @app.route('/admin')
# def admin():
#    return render_template("admin/index.html")

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
@login_required
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
        "downloads": song.downloads,
        "title": song.title,
        "downloadUrl": song.download_url,
        "streamUrl": song.stream_url,
        "duration": song.duration
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


@app.route("/stripe", methods=["POST"])
@csrf.exempt
def stripe_intent():
    try:
        intent = stripe.PaymentIntent.create(
            amount=100,
            currency='usd'
        )
        return jsonify({
          'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
