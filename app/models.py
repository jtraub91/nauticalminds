from app import db
from datetime import datetime


class Fan(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow())
    email = db.Column(db.String(40), unique=True, index=True, nullable=False)
    email_confirmed = db.Column(db.DateTime)

    def __repr__(self):
        return "<Fan_{}>".format(self.id)


class Song(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    plays = db.Column(db.Integer, default=0)

    def __repr__(self):
        return "<Song:{}>".format(self.name)
