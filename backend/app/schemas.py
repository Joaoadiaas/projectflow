from typing import Optional
from pydantic import BaseModel


class ClientBase(BaseModel):
    name: str
    contact: Optional[str] = None
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientOut(ClientBase):
    id: int

    class Config:
        orm_mode = True
