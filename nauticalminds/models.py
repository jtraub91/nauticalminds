import secrets

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Table
from sqlalchemy import text
from sqlalchemy.orm import declarative_base

from nauticalminds import db_engine
from nauticalminds import db_session

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    pk = Column("pk", Integer, primary_key=True)
    eth_address = Column(
        "eth_address", String(40), unique=True, index=True, nullable=False
    )
    nonce = Column("nonce", String(64))

    def set_new_nonce(self, nbytes=32):
        n = secrets.token_hex(nbytes=nbytes)
        self.nonce = n
        return n

    def __repr__(self):
        return f"<User (pk: {self.pk}, eth_address: {self.eth_address})>"


class NauticalMindsEp(Base):
    __tablename__ = "nautical_minds_ep"

    pk = Column("pk", String(40), primary_key=True)
    downloads = Column("downloads", Integer, server_default=text("0"))


class Song(Base):
    __tablename__ = "songs"

    pk = Column("pk", Integer, primary_key=True)
    filename = Column(String(40), unique=True, nullable=False)
    streams = Column("streams", Integer, server_default=text("0"))
    total_seconds_streamed = Column(
        "total_seconds_streamed", Integer, server_default=text("0")
    )


def create_tables():
    Base.metadata.create_all(db_engine)

    nmep_songs = [
        "gotta_let_you_know.mp3",
        "aint_gotta_care.mp3",
        "funk1.mp3",
        "spacy_stacy.mp3",
        "side_street_robbery.mp3",
        "off_the_clock.mp3",
    ]
    for filename in nmep_songs:
        song = Song()
        song.filename = filename
        db_session.add(song)
        db_session.commit()

    nmep = NauticalMindsEp()
    nmep.pk = "NauticalMindsEP.zip"
    db_session.add(nmep)
    db_session.commit()


def drop_tables():
    Base.metadata.drop_all(db_engine)
