from app import app, db
from app.models import Fan, Song
from app.email import send_email
from flask import abort, render_template, request, jsonify


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.is_json and request.method == 'POST':
        """Parse JSON, add email to database"""
        form = request.get_json()
        new_fan = Fan(email=form['email'])
        db.session.add(new_fan)
        db.session.commit()
        send_email('Thanks for subscribing!',
                   'jason@nauticalminds.com',
                   [new_fan.email],
                   'text body', '<h1>html body</h1>')
        return jsonify({
            "received_msg": form,
            "return_message": "A confirmation email has been sent to " + new_fan.email
        })
    elif not request.is_json and request.method == 'GET':
        return render_template("index.html")
    else:
        return abort(500)


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/admin')
def admin():
    return render_template("admin/index.html")


@app.route('/history')
def history():
    return render_template("history.html")


@app.route('/music')
def music():
    return render_template("music.html")


@app.route('/store')
def store():
    return render_template("store.html")


@app.route('/subscribe', methods=['POST'])
def subscribe():
    if request.is_json:
        pass
    else:
        return abort(500)


# @app.route('/blog')
# def blog():
#     return render_template("blog.html")


@app.route("/plays/<song_name>", methods=['GET', 'POST'])
def plays(**kwargs):
    if request.method == 'POST':
        song_name = kwargs.get('song_name', None)
        song = Song.query.filter_by(name=song_name).first()
        song.plays = song.plays + 1
        db.session.add(song)
        db.session.commit()
        return jsonify({
            "type": "POST",
            "result": "success",
            "name": song_name,
            "plays": song.plays
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
