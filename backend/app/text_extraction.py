# backend/app/text_extraction.py
import requests
from bs4 import BeautifulSoup
from docx import Document

# Extract text from a URL
def extract_text_from_url(url: str) -> str:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract and return the main text (you can customize this part)
    paragraphs = soup.find_all('p')
    text = ' '.join([para.get_text() for para in paragraphs])
    
    return text

# Extract text from a DOCX file
def extract_text_from_docx(file_path: str) -> str:
    doc = Document(file_path)
    text = ''
    for para in doc.paragraphs:
        text += para.text + '\n'
    
    return text

# General function to extract text based on input (URL or DOCX)
def extract_text_from_url_or_docx(url_or_docx: str) -> str:
    if url_or_docx.startswith('http'):
        return extract_text_from_url(url_or_docx)
    else:
        return extract_text_from_docx(url_or_docx)
