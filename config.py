import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Develop(object):
    DEBUG = True
    TESTING = True

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'forgotten-plants-smirnoff-angels-in-western-carriages'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')

    MAIL_DEBUG = True
    MAIL_SERVER = 'localhost'
    MAIL_PORT = os.environ.get('MAIL_PORT') or 5025
    """Run python -m smtpd -n -c DebuggingServer localhost:5025"""
