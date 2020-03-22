from flask import Flask
# from flask_admin import Admin
# from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from config import Develop, Production


app = Flask(__name__)
if app.config['ENV'] == 'production':
    app.config.from_object(Production)
elif app.config['ENV'] == 'development':
    app.config.from_object(Develop)
csrf = CSRFProtect(app)
db = SQLAlchemy(app)
# login = LoginManager(app)
# mail = Mail(app)
migrate = Migrate(app, db)

from app import routes, models

from app.models import Song

# initialize songs in db, if applicable
SONGS = ['gotta_let_you_know', 'aint_gotta_care', 'funk1', 'spacy_stacy', 'side_street_robbery', 'off_the_clock']
for song_name in SONGS:
    if not Song.query.filter_by(name=song_name):
        song = Song(name=song_name)
        db.session.add(song)
        db.session.commit()

# from flask_admin.contrib.sqla import ModelView
#
# app.config['FLASK_ADMIN_SWATCH'] = 'journal'
# admin = Admin(app, name='nautical minds', template_mode='bootstrap3')
# admin.add_view(ModelView(models.Fan, db.session))
