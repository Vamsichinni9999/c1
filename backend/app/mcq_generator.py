import requests
from urllib.parse import urlparse
import random
import re
from bs4 import BeautifulSoup

# Function to extract text from a valid URL
def extract_text_from_url(url: str) -> str:
    # Check if the URL has a valid schema (http:// or https://)
    parsed_url = urlparse(url)
    if not parsed_url.scheme:
        raise ValueError(f"Invalid URL: {url}. URL must start with 'http://' or 'https://'.")
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx, 5xx)
        
        # Use BeautifulSoup to parse and clean up the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        # Get the text inside paragraphs, headers, etc. (excluding scripts, styles, etc.)
        text = ' '.join(p.get_text() for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']))
        return text  # Return the cleaned text content of the URL
    except requests.exceptions.RequestException as e:
        # Handle errors like network issues, invalid URL, etc.
        raise ValueError(f"Failed to fetch content from the URL: {e}")

# A function to generate MCQs from the text
def generate_mcqs(url: str):
    # Extract text content from the URL
    try:
        text = extract_text_from_url(url)

        # Here we implement a simple MCQ generator based on key facts
        questions_and_options = []
        
        # Split text into sentences and filter out short or irrelevant sentences
        sentences = re.split(r'[.!?]', text)  # Split text into sentences
        sentences = [sentence.strip() for sentence in sentences if len(sentence.split()) > 5]  # Filter out short sentences
        
        # Generate MCQs from relevant sentences (focus on factual, simple sentences)
        question_number = 1  # Start with question number 1
        for sentence in sentences:
            if sentence and not any(keyword in sentence.lower() for keyword in ['http', 'javascript', 'cookie', 'script', 'html']):
                words = sentence.split()
                if len(words) > 2:
                    # Simple logic to form a question by replacing a word with a blank
                    answer = words[random.randint(0, len(words) - 1)]  # Random word for the blank
                    question = sentence.replace(answer, "_____", 1)
                    
                    # Create 3 other options (randomly selected, but ensure they are valid options)
                    options = [answer]
                    for _ in range(3):
                        # Randomly generate incorrect options (simple words from the text)
                        random_option = words[random.randint(0, len(words) - 1)]
                        if random_option != answer:
                            options.append(random_option)
                    random.shuffle(options)  # Shuffle options for randomness
                    
                    # Add the question and options to the list with question numbering
                    questions_and_options.append({
                        'question_number': question_number,
                        'question': question,
                        'options': options,
                        'correct_answer': answer
                    })
                    question_number += 1  # Increment question number
        
        if questions_and_options:
            return {
                "mcqs": questions_and_options,
                "text": text
            }
        else:
            return {"error": "No suitable text found to generate MCQs."}

    except ValueError as e:
        # Handle invalid URL or request error
        return {"error": str(e)}
