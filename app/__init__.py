from flask import Flask
# from flask_admin import Admin
# from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from config import Develop, Production


app = Flask(__name__)
app.config.from_object(Production)
csrf = CSRFProtect(app)
db = SQLAlchemy(app)
# login = LoginManager(app)
# mail = Mail(app)
migrate = Migrate(app, db)

from app import routes, models

# from flask_admin.contrib.sqla import ModelView
#
# app.config['FLASK_ADMIN_SWATCH'] = 'journal'
# admin = Admin(app, name='nautical minds', template_mode='bootstrap3')
# admin.add_view(ModelView(models.Fan, db.session))
