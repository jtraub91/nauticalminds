import os
import platform

import yaml
from flask import Flask

# from sqlalchemy import create_engine
# from sqlalchemy.orm import Session

# from web3 import Web3

app = Flask(__name__)

if app.config["ENV"] == "development":
    basedir = os.path.abspath(os.path.dirname(__file__))
    with open(os.path.join(basedir, "config.yaml")) as c:
        config = yaml.load(c, Loader=yaml.FullLoader)
else:
    if platform.system() in ["Windows", "Darwin"]:
        print(f"Can't run production code on {platform.system()} OS!")
        exit()
    else:
        with open("/opt/nauticalminds/config.yaml") as c:
            config = yaml.load(c, Loader=yaml.FullLoader)

app.config.from_mapping(config)
# db_engine = create_engine(config["DB_URI"], echo=True)
# db_session = Session(db_engine)
# web3 = Web3(Web3.HTTPProvider(config["WEB3_PROVIDER"]))

from nauticalminds import routes
