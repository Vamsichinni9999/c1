# app/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from .mcq_generator import generate_mcqs

app = FastAPI()

# Request body model for MCQ generation (expects a URL as input)
class MCQRequest(BaseModel):
    url: str

# Route to generate MCQs from the URL
@app.post("/generate-mcqs")
async def generate_mcqs_route(request: MCQRequest):
    url = request.url
    mcqs = generate_mcqs(url)  # Call the MCQ generation function
    return mcqs
# app/main.py
from fastapi.middleware.cors import CORSMiddleware


# Allow cross-origin requests from your frontend URL (e.g., http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
