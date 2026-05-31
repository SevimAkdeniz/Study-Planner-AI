import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Dataset oku
df = pd.read_csv("dataset.csv")

# Encoderlar
difficulty_encoder = LabelEncoder()
missing_encoder = LabelEncoder()
priority_encoder = LabelEncoder()

df["difficulty"] = difficulty_encoder.fit_transform(
    df["difficulty"]
)

df["missingLevel"] = missing_encoder.fit_transform(
    df["missingLevel"]
)

df["priority"] = priority_encoder.fit_transform(
    df["priority"]
)

# X ve y
X = df.drop("priority", axis=1)
y = df["priority"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.15,
    random_state=42,
    stratify=y
)

# Daha güçlü tree
model = DecisionTreeClassifier(
    criterion="entropy",
    max_depth=10,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(
    y_test,
    y_pred
)

print(
    f"Model Accuracy: %{accuracy * 100:.2f}"
)

# Save
joblib.dump(
    model,
    "study_planner_model.pkl"
)

joblib.dump(
    difficulty_encoder,
    "difficulty_encoder.pkl"
)

joblib.dump(
    missing_encoder,
    "missing_encoder.pkl"
)

joblib.dump(
    priority_encoder,
    "priority_encoder.pkl"
)

print(
    "Model başarıyla kaydedildi."
)