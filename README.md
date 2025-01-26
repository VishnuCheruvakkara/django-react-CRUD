# Django + React CRUD Application

This project is a full-stack CRUD application built with **Django** for the backend and **React**+**vite** for the frontend. It features **JWT-based authentication**, **Django Serializers**, and **Redux** for state management. 

The application includes:

- **Admin Side**: Manage user data with functionalities like adding, editing, updating, and deleting users, with a **search implementation** for easy navigation.
- **User Side**: Users can sign up, sign in, and edit their profile data seamlessly.
### Video Demo
[Watch the video demo here](https://www.linkedin.com/posts/vishnu-cheruvakkara-231b8b235_python-djangoreact-pythondjangoreactproject-activity-7288911894915035136-6zPY?utm_source=share&utm_medium=member_desktop)

---

## Features

### User Side
- **Sign Up**: Create an account with email and password.
- **Sign In**: Authenticate with JSON Web Tokens (JWT).
- **Profile Management**: Update and edit user profile data.

### Admin Side
- **User Management**: Add, edit, delete, and update user information.
- **Search**: Efficiently search through user data using filters and queries.

### Common Features
- Secure backend using Django Rest Framework (DRF).
- State management with Redux for a responsive and dynamic frontend experience.
- JWT authentication to manage user sessions securely.

---

## Tech Stack

### Backend
- **Django**: Backend framework for managing business logic.
- **Django Rest Framework (DRF)**: For API creation.
- **JWT Authentication**: Secure token-based authentication.
- **SQLite / PostgreSQL**: Database for storing user data.

### Frontend
- **React**: UI library for building interactive user interfaces.
- **Redux**: State management for application-wide state.
- **Axios**: For API requests to the backend.

---

## Installation

### Prerequisites
- Python 3.9 or higher
- Node.js (v16 or higher) and npm/yarn
- PostgreSQL (or SQLite for development)

### Backend Setup
```bash
# 1. Clone the repository
git clone https://github.com/VishnuCheruvakkara/django-react-CRUD.git


# 2. Navigate to the backend directory
cd django-react-crud/backend

# 3. Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Apply database migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create a superuser for admin access
python manage.py createsuperuser

# 7. Run the backend server
python manage.py runserver
# 1. Example of an additional command you might need
```

### Frontend Setup
```bash
# 1. Navigate to the frontend directory
cd frontend
cd front-end

# 2. Install JavaScript dependencies
npm install  # Or use yarn install

# 3. Start the development server
npm run dev  # This will start the Vite development server
```

