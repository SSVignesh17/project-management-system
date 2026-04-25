from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_db, require_role
from ..models import Task, User
from ..schemas import TaskSchema

router = APIRouter()

developer_required = Depends(require_role("developer"))

@router.get("/tasks", response_model=list[TaskSchema])
def get_my_tasks(current_user: User = developer_required, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.developer_id == current_user.id).all()

@router.put("/tasks/{task_id}")
def update_status(task_id: int, status: str, current_user: User = developer_required, db: Session = Depends(get_db)):
    task = db.query(Task).get(task_id)
    if task is None or task.developer_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    return {"msg": "Task status updated"}

@router.get("/profile")
def get_profile(current_user: User = developer_required):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
    }