from fastapi import FastAPI
from .database import Base, engine
from .routers import admin, developer
from .routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(admin.router, prefix="/admin")
app.include_router(developer.router, prefix="/developer")

app.include_router(auth.router)