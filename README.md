# Project Management System

A full-stack web application for managing projects, tasks, and users with role-based access control.

## Features

- **User Authentication**: Register and login as Admin or Developer
- **Role-Based Access**:
  - **Admin**: Create/manage projects, developers, and tasks
  - **Developer**: View and update assigned tasks
- **Project Management**: Create, list, update, and delete projects
- **Task Management**: Assign tasks to developers, track status (Pending, In Progress, Completed)
- **Responsive UI**: Clean, modern interface built with React

## Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy, MySQL, JWT Authentication
- **Frontend**: React, CSS
- **Database**: MySQL

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL Server
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Project management System"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   ```

   - Create a MySQL database named `project_db`
   - Copy `.env.example` to `.env` and update the `DATABASE_URL` if needed

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```
   - Server runs on `http://127.0.0.1:8000`
   - API docs available at `http://127.0.0.1:8000/docs`

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```
   - App runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token

### Admin (requires Bearer token)
- `GET /admin/projects` - List all projects
- `POST /admin/projects` - Create a project
- `PUT /admin/projects/{id}` - Update a project
- `DELETE /admin/projects/{id}` - Delete a project
- `GET /admin/developers` - List all developers
- `POST /admin/developers` - Create a developer
- `PUT /admin/developers/{id}` - Update a developer
- `DELETE /admin/developers/{id}` - Delete a developer
- `GET /admin/tasks` - List all tasks
- `POST /admin/tasks` - Create a task
- `PUT /admin/tasks/{id}` - Update a task
- `DELETE /admin/tasks/{id}` - Delete a task

### Developer (requires Bearer token)
- `GET /developer/tasks` - Get assigned tasks
- `PUT /developer/tasks/{id}` - Update task status

## Usage

1. Register an Admin account via the frontend
2. Login as Admin to create projects and developers
3. Assign tasks to developers
4. Developers can login to view and update their tasks

## Project Structure

```
Project management System/
├── backend/
│   ├── app/
│   │   ├── auth.py          # Authentication helpers
│   │   ├── database.py      # DB connection
│   │   ├── main.py          # FastAPI app
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── routers/         # API routes
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   └── developer.py
│   │   └── schemas.py       # Pydantic schemas
│   └── test_auth.py         # Test script
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api.js           # API client
│   │   ├── App.js           # Main React app
│   │   ├── index.js         # Entry point
│   │   └── styles.css       # Styles
│   ├── package.json         # Node dependencies
│   └── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request
