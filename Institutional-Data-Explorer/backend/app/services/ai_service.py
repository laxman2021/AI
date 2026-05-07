import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Base backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Models folder
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Create models folder if not exists
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODELS_DIR, "model.pkl")
COLUMNS_PATH = os.path.join(MODELS_DIR, "model_columns.pkl")


def train_model(csv_path, target):

    print("TRAINING STARTED")

    df = pd.read_csv(csv_path)

    print(df.head())

    # Convert categorical columns
    df = pd.get_dummies(df)

    # Check target exists
    if target not in df.columns:
        return {
            "error": f"Target column '{target}' not found"
        }

    X = df.drop(columns=[target])
    y = df[target]

    # Save training columns
    joblib.dump(X.columns.tolist(), COLUMNS_PATH)

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    # Train model
    model = RandomForestClassifier()

    model.fit(X_train, y_train)

    # Save model
    joblib.dump(model, MODEL_PATH)

    # Accuracy
    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    return {
        "message": "Model trained successfully",
        "accuracy": round(accuracy * 100, 2)
    }


def predict(payload):

    print("Loading model...")

    # Check model exists
    if not os.path.exists(MODEL_PATH):
        return {
            "error": "Model not trained yet"
        }

    model = joblib.load(MODEL_PATH)
    columns = joblib.load(COLUMNS_PATH)

    # Convert request to dataframe
    df = pd.DataFrame([payload])

    # Convert categorical data
    df = pd.get_dummies(df)

    # Match training columns
    df = df.reindex(columns=columns, fill_value=0)

    print(df)

    # Predict
    prediction = model.predict(df)

    return {
        "prediction": str(prediction[0])
    }
    