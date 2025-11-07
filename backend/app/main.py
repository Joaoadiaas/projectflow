from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from . import models, schemas

# Cria as tabelas no banco (se ainda não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectFlow API",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "ProjectFlow API is running 🚀"}


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
    clients = db.query(models.Client).all()
    return clients

