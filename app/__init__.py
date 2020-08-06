import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
# from flask_admin import Admin
from flask_login import LoginManager, logout_user
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from config import Develop, Production


app = Flask(__name__)
if app.config['ENV'] == 'production':
    app.config.from_object(Production())
elif app.config['ENV'] == 'development':
    app.config.from_object(Develop())
csrf = CSRFProtect(app)
db = SQLAlchemy(app)
login = LoginManager(app)
# mail = Mail(app)
migrate = Migrate(app, db)

from app import routes, models

# from flask_admin.contrib.sqla import ModelView
#
# app.config['FLASK_ADMIN_SWATCH'] = 'journal'
# admin = Admin(app, name='nautical minds', template_mode='bootstrap3')
# admin.add_view(ModelView(models.Fan, db.session))


# setup logging
import sys
print(sys.version)
file_handler = RotatingFileHandler(f"{app.config['LOG_DIR']}/nauticalminds.log", "a", 1 * 1024 * 1024, 10)
file_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"))
app.logger.setLevel(logging.INFO)
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.info('Nautical Minds flask app startup...')
