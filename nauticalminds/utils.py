from functools import wraps

import jwt
from flask import abort
from flask import current_app
from flask import request


def token_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        token_cookie = request.cookies.get("token")
        print(token_cookie)
        if not token_cookie:
            return abort(401)
        try:
            payload = jwt.decode(
                token_cookie, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            print(payload)
        except Exception:
            return abort(401)

        try:
            # current_app.ensure_sync available in Flask >= 2.0
            return current_app.ensure_sync(func)(*args, **kwargs)
        except AttributeError:
            return func(*args, **kwargs)

    return decorated_view
