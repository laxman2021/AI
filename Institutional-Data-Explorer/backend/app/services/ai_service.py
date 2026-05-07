import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model(df, target):
    X = df.drop(columns=[target])
    y = df[target]

    X = pd.get_dummies(X)

    X_train, X_test, y_train, y_test = train_test_split(X, y)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test)

    joblib.dump(model, "model.pkl")

    return acc

def predict(data):
    model = joblib.load("model.pkl")
    df = pd.DataFrame([data])
    df = pd.get_dummies(df)
    return model.predict(df)[0]