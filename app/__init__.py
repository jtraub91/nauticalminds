import json
import os

from flask import Flask
from sqlalchemy import create_engine

basedir = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(basedir, "config.json")) as c:
    config = json.load(c)

app = Flask(__name__)
db_engine = create_engine(config["dbUri"], echo=True)

