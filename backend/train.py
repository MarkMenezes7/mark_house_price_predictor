import json
import joblib
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import root_mean_squared_error, r2_score
from xgboost import XGBRegressor

def train():
    print("Loading California Housing Dataset...")
    # NOTE: This dataset uses 1990-based California census data.
    # The target variable is expressed in hundreds of thousands of dollars ($100,000).
    data = fetch_california_housing()
    X = data.data
    y = data.target
    feature_names = data.feature_names

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Define the pipeline with StandardScaler and XGBRegressor
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('xgb', XGBRegressor(objective='reg:squarederror', random_state=42))
    ])

    # Best-known hyperparameter space for California Housing with XGBoost
    param_grid = {
        'xgb__n_estimators': [100, 200],
        'xgb__learning_rate': [0.05, 0.1],
        'xgb__max_depth': [5, 7],
        'xgb__subsample': [0.8],
        'xgb__colsample_bytree': [0.8]
    }

    print("Starting hyperparameter tuning (GridSearchCV)...")
    grid_search = GridSearchCV(
        estimator=pipeline,
        param_grid=param_grid,
        scoring='neg_root_mean_squared_error',
        cv=3,
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_

    print("Best parameters found:", grid_search.best_params_)

    print("Evaluating best model...")
    predictions = best_model.predict(X_test)
    rmse = root_mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"RMSE: {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")

    # Extract feature importances from the XGBoost model within the pipeline
    xgb_model = best_model.named_steps['xgb']
    importances = xgb_model.feature_importances_
    
    # Map feature names to their importances
    feature_importance_dict = {
        name: float(imp) for name, imp in zip(feature_names, importances)
    }
    
    # Sort by importance descending
    feature_importance_dict = dict(sorted(feature_importance_dict.items(), key=lambda item: item[1], reverse=True))

    model_path = "model.joblib"
    print(f"Saving model to {model_path}...")
    joblib.dump(best_model, model_path)
    
    importance_path = "feature_importance.json"
    print(f"Saving feature importances to {importance_path}...")
    with open(importance_path, 'w') as f:
        json.dump(feature_importance_dict, f, indent=4)

    print("Training and extraction complete.")

if __name__ == "__main__":
    train()
