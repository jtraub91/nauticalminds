import re

from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField
from wtforms.validators import ValidationError, InputRequired

class AdminLogin(FlaskForm):

    username = StringField('username')
    password = PasswordField('password')
    recaptcha = RecaptchaField()


class LoginForm(FlaskForm):
    class Meta:
        csrf = False

    email = StringField("email")
    password = PasswordField("password", validators=[InputRequired(message="Please enter a password.")])

    def validate_email(self, email):
        pattern = r"^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"
        if re.match(pattern, email.data):
            return True
        raise ValidationError("Please enter a valid email address.")
