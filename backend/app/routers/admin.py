from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_db, require_role, hash_password
from ..models import Project, Task, User
from ..schemas import (
    ProjectCreateSchema,
    ProjectSchema,
    TaskCreateSchema,
    TaskSchema,
    TaskUpdateSchema,
    UserReadSchema,
    RegisterSchema,
)

router = APIRouter()

admin_required = Depends(require_role("admin"))

@router.post("/projects", response_model=ProjectSchema)
def create_project(project: ProjectCreateSchema, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(Project).filter(Project.name == project.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project already exists")

    new_project = Project(name=project.name, description=project.description or "")
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/projects", response_model=list[ProjectSchema])
def list_projects(db: Session = Depends(get_db), _: User = admin_required):
    return db.query(Project).all()

@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(project_id: int, project: ProjectCreateSchema, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(Project).get(project_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Project not found")
    existing.name = project.name
    existing.description = project.description or ""
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(Project).get(project_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(existing)
    db.commit()
    return {"detail": "Project deleted"}

@router.get("/developers", response_model=list[UserReadSchema])
def list_developers(db: Session = Depends(get_db), _: User = admin_required):
    return db.query(User).filter(User.role == "developer").all()

@router.post("/developers", response_model=UserReadSchema)
def create_developer(user_data: RegisterSchema, db: Session = Depends(get_db), _: User = admin_required):
    if user_data.role.strip().lower() != "developer":
        raise HTTPException(status_code=400, detail="Developer role required")

    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Developer already exists")

    developer = User(
        username=user_data.username,
        password=hash_password(user_data.password),
        role="developer",
    )
    db.add(developer)
    db.commit()
    db.refresh(developer)
    return developer

@router.put("/developers/{developer_id}", response_model=UserReadSchema)
def update_developer(developer_id: int, user_data: UserReadSchema, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(User).get(developer_id)
    if existing is None or existing.role != "developer":
        raise HTTPException(status_code=404, detail="Developer not found")
    existing.username = user_data.username
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/developers/{developer_id}")
def delete_developer(developer_id: int, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(User).get(developer_id)
    if existing is None or existing.role != "developer":
        raise HTTPException(status_code=404, detail="Developer not found")
    db.delete(existing)
    db.commit()
    return {"detail": "Developer deleted"}

@router.post("/tasks", response_model=TaskSchema)
def create_task(task: TaskCreateSchema, db: Session = Depends(get_db), _: User = admin_required):
    project = db.query(Project).get(task.project_id)
    developer = db.query(User).get(task.developer_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if developer is None or developer.role != "developer":
        raise HTTPException(status_code=404, detail="Developer not found")

    new_task = Task(
        title=task.title,
        description=task.description or "",
        status="Pending",
        project_id=task.project_id,
        developer_id=task.developer_id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/tasks", response_model=list[TaskSchema])
def list_tasks(db: Session = Depends(get_db), _: User = admin_required):
    return db.query(Task).all()

@router.put("/tasks/{task_id}", response_model=TaskSchema)
def update_task(task_id: int, task_data: TaskUpdateSchema, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(Task).get(task_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task_data.title is not None:
        existing.title = task_data.title
    if task_data.description is not None:
        existing.description = task_data.description
    if task_data.status is not None:
        existing.status = task_data.status
    if task_data.project_id is not None:
        if db.query(Project).get(task_data.project_id) is None:
            raise HTTPException(status_code=404, detail="Project not found")
        existing.project_id = task_data.project_id
    if task_data.developer_id is not None:
        developer = db.query(User).get(task_data.developer_id)
        if developer is None or developer.role != "developer":
            raise HTTPException(status_code=404, detail="Developer not found")
        existing.developer_id = task_data.developer_id
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), _: User = admin_required):
    existing = db.query(Task).get(task_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(existing)
    db.commit()
    return {"detail": "Task deleted"}