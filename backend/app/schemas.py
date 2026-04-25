from typing import List, Optional
from pydantic import BaseModel, Field

class RegisterSchema(BaseModel):
    username: str
    password: str = Field(..., max_length=72)
    role: str  # admin or developer

class LoginSchema(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    role: str

class UserReadSchema(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True

class ProjectCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectSchema(ProjectCreateSchema):
    id: int

    class Config:
        orm_mode = True

class TaskCreateSchema(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    developer_id: int

class TaskUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    project_id: Optional[int] = None
    developer_id: Optional[int] = None

class TaskSchema(TaskCreateSchema):
    id: int
    status: str

    class Config:
        orm_mode = True