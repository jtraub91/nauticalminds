import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Develop(object):
    DEBUG = True
    SECRET_KEY = "forgotten-plants-smirnoff-angels-in-western-carriages"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

    # MAIL_DEBUG = True
    # MAIL_SERVER = 'localhost'
    # MAIL_PORT = os.environ.get('MAIL_PORT') or 5025
    # """Run python -m smtpd -n -c DebuggingServer localhost:5025"""


class Production(object):
    def __init__(self):
        self.SECRET_KEY = os.environ['SECRET_KEY']

        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.SQLALCHEMY_DATABASE_URI = 'postgresql://nautical:minds@localhost/nauticalminds'
