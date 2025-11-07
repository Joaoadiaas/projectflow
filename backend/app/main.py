from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from . import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectFlow API",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "ProjectFlow API is running 🚀"}


# ===== CLIENTS ===== #

@app.post("/clients", response_model=schemas.ClientOut)
def create_client(client_in: schemas.ClientCreate, db: Session = Depends(get_db)):
    client = models.Client(
        name=client_in.name,
        contact=client_in.contact,
        notes=client_in.notes,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@app.get("/clients", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()


# ===== PROJECTS ===== #

@app.post("/projects", response_model=schemas.ProjectOut)
def create_project(project_in: schemas.ProjectCreate, db: Session = Depends(get_db)):
    project = models.Project(
        name=project_in.name,
        type=project_in.type,
        status=project_in.status,
        deadline=project_in.deadline,
        client_id=project_in.client_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=list[schemas.ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()


# ===== TASKS ===== #

@app.post("/tasks", response_model=schemas.TaskOut)
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = models.Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        assignee=task_in.assignee,
        due_date=task_in.due_date,
        project_id=task_in.project_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.get("/tasks", response_model=list[schemas.TaskOut])
def list_tasks(
    db: Session = Depends(get_db),
):
    return db.query(models.Task).all()


# ===== EVENTS ===== #

@app.post("/events", response_model=schemas.EventOut)
def create_event(event_in: schemas.EventCreate, db: Session = Depends(get_db)):
    event = models.Event(
        title=event_in.title,
        date=event_in.date,
        location=event_in.location,
        link=event_in.link,
        status=event_in.status,
        project_id=event_in.project_id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@app.get("/events", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()


