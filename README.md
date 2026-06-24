# California House Price Predictor

An AI-powered real estate valuation model built with React and FastAPI. This application predicts the median house value in a California neighborhood based on various metrics like median income, house age, average rooms, and geographical location.

## Features

- **Interactive UI**: A sleek, modern user interface built with React, TypeScript, and Vite.
- **Machine Learning**: An XGBoost regression model trained on the California Housing Dataset to provide accurate predictions.
- **Geospatial Input**: Pick a location directly on an interactive map using Leaflet.
- **Feature Importance Insights**: Visualizes the top 5 driving factors for predictions using Recharts.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Recharts, React-Leaflet
- **Backend**: Python, FastAPI, Scikit-Learn, XGBoost, Uvicorn

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the backend)

### 1. Setup the Backend

Navigate to the `backend` directory, create a virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Train the model (if `model.joblib` is missing) and start the FastAPI server:
```bash
# This step will generate `model.joblib` and `feature_importance.json`
python train.py

# Start the server
uvicorn main:app --reload
```
The backend API will be available at `http://127.0.0.1:8000`.

### 2. Setup the Frontend

Navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.
