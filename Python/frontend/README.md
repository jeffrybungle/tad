# Vue.js and Python Project

This project is a web application that utilizes Vue.js for the frontend and Python for the backend. Below are the instructions for setting up and running both parts of the application.

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the necessary dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run serve
   ```

4. Open your browser and go to `http://localhost:8080` to view the application.

## Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   python app.py
   ```

5. The backend API will be available at `http://localhost:5000`.

## Project Structure

- `frontend/`: Contains the Vue.js frontend application.
- `backend/`: Contains the Python backend application.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.