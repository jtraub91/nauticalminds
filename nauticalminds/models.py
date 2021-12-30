from sqlalchemy import MetaData
from sqlalchemy import Integer
from sqlalchemy import Table
from sqlalchemy import String
from sqlalchemy import Column

from nauticalminds import db_engine

meta = MetaData()

users = Table(
    "users", meta,
    Column("id", Integer, primary_key=True),
    Column("eth_address", String(64), index=True, nullable=False)
)


def create_tables():
    meta.create_all(db_engine)
