import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "model_columns.pkl")


def train_model(csv_path, target):

    print("TRAINING STARTED")

    df = pd.read_csv(csv_path)

    print(df.head())

    # Convert categorical columns
    df = pd.get_dummies(df)

    # Features and target
    X = df.drop(columns=[target])
    y = df[target]

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    print("Saving columns...")

    # Save training columns
    joblib.dump(X.columns.tolist(), COLUMNS_PATH)

    print("Training model...")

    model = RandomForestClassifier()

    model.fit(X_train, y_train)

    print("Saving model...")

    # Save model
    joblib.dump(model, MODEL_PATH)

    # Accuracy
    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    return {
        "accuracy": round(accuracy * 100, 2)
    }


def predict(payload):

    print("Loading model...")

    model = joblib.load(MODEL_PATH)
    columns = joblib.load(COLUMNS_PATH)

    # Create dataframe
    df = pd.DataFrame([payload])

    # Convert categorical values
    df = pd.get_dummies(df)

    # Match training columns
    df = df.reindex(columns=columns, fill_value=0)

    # Predict
    prediction = model.predict(df)

    return {
        "prediction": str(prediction[0])
    }