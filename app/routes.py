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


@app.route("/music", methods=['GET', 'POST'])
def plays(**kwargs):
    if request.method == 'POST':
        song_id = request.args.get('plays')
        song = Song.query.filter_by(id=song_id).first()
        song.plays = song.plays + 1
        db.session.add(song)
        db.session.commit()
        return jsonify({
            "message": "success",
            "id": song.id,
            "name": song.name,
            "plays": song.plays,
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
