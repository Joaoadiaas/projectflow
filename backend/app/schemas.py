from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


# ==== CLIENT ==== #

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


# ==== PROJECT ==== #

class ProjectBase(BaseModel):
    name: str
    type: Optional[str] = None
    status: Optional[str] = "ACTIVE"
    deadline: Optional[datetime] = None
    client_id: Optional[int] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int

    class Config:
        orm_mode = True


# ==== TASK ==== #

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "BACKLOG"
    priority: Optional[str] = "MEDIUM"
    assignee: Optional[str] = None
    due_date: Optional[datetime] = None
    project_id: int


class TaskCreate(TaskBase):
    pass


class TaskOut(TaskBase):
    id: int

    class Config:
        orm_mode = True


# ==== EVENT ==== #

class EventBase(BaseModel):
    title: str
    date: Optional[datetime] = None
    location: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = "SCHEDULED"
    project_id: Optional[int] = None


class EventCreate(EventBase):
    pass


class EventOut(EventBase):
    id: int

    class Config:
        orm_mode = True

