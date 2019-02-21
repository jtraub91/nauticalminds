from app import db


class Fan(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(40), unique=True, index=True, nullable=False)
    email_confirmed = db.Column(db.DateTime)

    def __repr__(self):
        return "<Fan_{}>".format(self.id)
