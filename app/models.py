from app import db
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import String
from werkzeug.security import generate_password_hash, check_password_hash


class Song(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    absolute_file_path = db.Column(String(128))
    artist = db.Column(String(128))
    album = db.Column(String(128))
    name = db.Column(String(128))
    info = db.Column(JSONB)
    plays = db.Column(db.Integer, default=0)
    pauses = db.Column(db.Integer, default=0)
    
    def __init__(self, **kwargs):
        self.absolute_file_path = kwargs.get("absolute_file_path")
        self.artist = kwargs.get("artist")
        self.album = kwargs.get("album")
        self.name = kwargs.get("name")
        self.info = kwargs.get("info")
        
    def incr_plays(self):
        # TODO: function not tested
        self.plays = self.plays + 1

    def incr_pauses(self):
        # TODO: function not tested
        self.pauses = self.pauses + 1

    def __repr__(self):
        return f"<Song id={self.id} artist={self.artist} name={self.name}>"


class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(String(128), index=True, unique=True, nullable=False)
    email_confirmed = db.Column(db.Boolean, default=False)
    first_name = db.Column(String(128))
    last_name = db.Column(String(128))

    password_hash = db.Column(db.String(128))

    # comments = db.relationship('Comment', backref='user', lazy='dynamic')
    # orders = db.relationship('Order', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
