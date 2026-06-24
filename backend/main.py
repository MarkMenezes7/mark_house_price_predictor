import os
import json
import logging
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CaliforniaHousePredictor")

# Setup Rate Limiting
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="California House Price Predictor API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
importance_path = os.path.join(os.path.dirname(__file__), "feature_importance.json")

model = None
feature_importances = {}

@app.on_event("startup")
def load_resources():
    global model, feature_importances
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        logger.info("Model loaded successfully.")
    else:
        logger.warning(f"Model not found at {model_path}. Please run train.py.")

    if os.path.exists(importance_path):
        with open(importance_path, 'r') as f:
            feature_importances = json.load(f)
        logger.info("Feature importances loaded successfully.")
    else:
        logger.warning(f"Feature importances not found at {importance_path}.")

class PredictionRequest(BaseModel):
    MedInc: float = Field(..., ge=0.5, le=15.0, description="Median Income ($10k)")
    HouseAge: float = Field(..., ge=1.0, le=52.0, description="House Age (Years)")
    AveRooms: float = Field(..., ge=1.0, le=20.0, description="Average Rooms")
    AveBedrms: float = Field(..., ge=0.5, le=10.0, description="Average Bedrooms")
    Population: float = Field(..., ge=10.0, le=5000.0, description="Block Population")
    AveOccup: float = Field(..., ge=1.0, le=10.0, description="Average Occupancy")
    Latitude: float = Field(..., ge=32.0, le=42.0, description="Latitude")
    Longitude: float = Field(..., ge=-125.0, le=-114.0, description="Longitude")

class PredictionResponse(BaseModel):
    prediction: float

@app.get("/feature-importance")
@limiter.limit("30/minute")
def get_feature_importance(request: Request):
    if not feature_importances:
        raise HTTPException(status_code=404, detail="Feature importances not available.")
    return feature_importances

@app.post("/predict", response_model=PredictionResponse)
@limiter.limit("30/minute")
def predict(request: Request, data: PredictionRequest):
    if model is None:
        logger.error("Prediction attempted but model is not loaded.")
        raise HTTPException(status_code=503, detail="Service unavailable. Model is not loaded.")
    
    logger.info(f"Received prediction request: {data.dict()}")

    features = np.array([[
        data.MedInc,
        data.HouseAge,
        data.AveRooms,
        data.AveBedrms,
        data.Population,
        data.AveOccup,
        data.Latitude,
        data.Longitude
    ]])
    
    try:
        prediction = model.predict(features)[0]
        # the dataset target is expressed in hundreds of thousands of dollars ($100,000)
        predicted_value = float(prediction) * 100000
        logger.info(f"Prediction successful: {predicted_value}")
        return PredictionResponse(prediction=predicted_value)
    except Exception as e:
        logger.error(f"Prediction failed with error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error during prediction.")
