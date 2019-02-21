from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField


class AdminLogin(FlaskForm):

    username = StringField('username')
    password = PasswordField('password')
    recaptcha = RecaptchaField()
