from sqlalchemy import Column, Integer, String, Text
from .db import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
