from app import db
from datetime import datetime
from sqlalchemy.types import JSON


class Song(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    safe_name = db.Column(db.String(128), nullable=True)
    info = db.Column(JSON)
    plays = db.Column(db.Integer, default=0)
    pauses = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<Song_{self.id}>"
