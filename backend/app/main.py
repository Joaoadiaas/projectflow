from fastapi import FastAPI

app = FastAPI(
    title="ProjectFlow API",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "ProjectFlow API is running 🚀"}
