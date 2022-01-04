import secrets

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Table
from sqlalchemy.orm import declarative_base

from nauticalminds import db_engine

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    pk = Column("pk", Integer, primary_key=True)
    eth_address = Column("eth_address", String(40), index=True, nullable=False)
    nonce = Column("nonce", String(64))

    def set_new_nonce(self, nbytes=32):
        n = secrets.token_hex(nbytes=nbytes)
        self.nonce = n
        return n

    def __repr__(self):
        return f"<User (pk: {self.pk}, eth_address: {self.eth_address})"


def create_tables():
    Base.metadata.create_all(db_engine)


def drop_tables():
    Base.metadata.drop_all(db_engine)
