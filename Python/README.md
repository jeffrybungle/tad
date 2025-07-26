# Vue-Python Project

This project is a full-stack application that utilizes Vue.js for the frontend and Python for the backend. Below are the instructions for setting up and running both parts of the application.

## Project Structure

```
vue-python-project
├── backend
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   └── HelloWorld.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the backend server:
   ```
   python app.py
   ```

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the required Node.js packages:
   ```
   npm install
   ```

3. Run the frontend application:
   ```
   npm run serve
   ```

## Accessing the Application

- The backend API will be available at `http://localhost:5000` (or the port specified in `app.py`).
- The frontend application will be available at `http://localhost:8080` (or the port specified in the Vue.js configuration).

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see in this project.