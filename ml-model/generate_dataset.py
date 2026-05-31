import pandas as pd
import random


def calculate_priority(
    knowledge,
    difficulty,
    grade,
    missing,
    days_left
):
    score = 0

    # Bilgi seviyesi
    score += (6 - knowledge)

    # Zorluk
    if difficulty == "hard":
        score += 3
    elif difficulty == "medium":
        score += 2
    else:
        score += 1

    # Önceki not
    if grade < 50:
        score += 4
    elif grade < 70:
        score += 2
    else:
        score += 0

    # Eksiklik
    if missing == "high":
        score += 4
    elif missing == "medium":
        score += 2
    else:
        score += 0

    # Sınava kalan gün
    if days_left <= 3:
        score += 5
    elif days_left <= 7:
        score += 3
    elif days_left <= 14:
        score += 2
    else:
        score += 0

    # Label
    if score >= 14:
        return "very_high"
    elif score >= 10:
        return "high"
    elif score >= 6:
        return "medium"
    else:
        return "low"


data = []

difficulty_options = [
    "easy",
    "medium",
    "hard"
]

missing_options = [
    "low",
    "medium",
    "high"
]

for _ in range(3000):
    knowledge = random.randint(1, 5)
    difficulty = random.choice(
        difficulty_options
    )
    grade = random.randint(20, 100)
    missing = random.choice(
        missing_options
    )
    days_left = random.randint(1, 30)

    priority = calculate_priority(
        knowledge,
        difficulty,
        grade,
        missing,
        days_left
    )

    data.append({
        "knowledgeLevel": knowledge,
        "difficulty": difficulty,
        "previousGrade": grade,
        "missingLevel": missing,
        "daysLeft": days_left,
        "priority": priority
    })

df = pd.DataFrame(data)

df.to_csv(
    "dataset.csv",
    index=False
)

print(
    "Yeni dataset başarıyla üretildi."
)