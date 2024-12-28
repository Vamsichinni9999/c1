# backend/app/quiz_validator.py

# Example: Simple validation function to check answers (expand logic as needed)
def validate_answers(answers: list) -> int:
    correct_answers = ["Option A", "Option B", "Option C"]  # Example correct answers
    score = 0
    for i, answer in enumerate(answers):
        if answer == correct_answers[i]:
            score += 1
    return score
