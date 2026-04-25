from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(200), nullable=False)
    role = Column(String(20), nullable=False)
    assigned_tasks = relationship("Task", back_populates="developer", foreign_keys="Task.developer_id")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), default="")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), default="")
    status = Column(String(50), default="Pending")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    developer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project = relationship("Project", back_populates="tasks")
    developer = relationship("User", back_populates="assigned_tasks")