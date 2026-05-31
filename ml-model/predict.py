import sys
import json
import joblib
import pandas as pd
import os

# predict.py'nin bulunduğu klasör
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# Model yolları
model_path = os.path.join(
    BASE_DIR,
    "study_planner_model.pkl"
)

difficulty_encoder_path = os.path.join(
    BASE_DIR,
    "difficulty_encoder.pkl"
)

missing_encoder_path = os.path.join(
    BASE_DIR,
    "missing_encoder.pkl"
)

priority_encoder_path = os.path.join(
    BASE_DIR,
    "priority_encoder.pkl"
)

# Load
model = joblib.load(model_path)

difficulty_encoder = joblib.load(
    difficulty_encoder_path
)

missing_encoder = joblib.load(
    missing_encoder_path
)

priority_encoder = joblib.load(
    priority_encoder_path
)

# Input
input_data = json.loads(
    sys.argv[1]
)

df = pd.DataFrame([input_data])

# Train sırasıyla aynı olmalı
df = df[
    [
        "knowledgeLevel",
        "difficulty",
        "previousGrade",
        "missingLevel",
        "daysLeft",
    ]
]

# Encode
df["difficulty"] = (
    difficulty_encoder.transform(
        df["difficulty"]
    )
)

df["missingLevel"] = (
    missing_encoder.transform(
        df["missingLevel"]
    )
)

# Predict
prediction = model.predict(df)

priority = (
    priority_encoder.inverse_transform(
        prediction
    )[0]
)

print(
    json.dumps({
        "priority": priority
    })
)