from fastapi import FastAPI
from pydantic import BaseModel
import torch
import joblib
from transformers import MobileBertTokenizer, MobileBertForSequenceClassification

# Load model, tokenizer, and label encoder
model_path = "mobilebert_severity_model"
tokenizer = MobileBertTokenizer.from_pretrained(model_path)
model = MobileBertForSequenceClassification.from_pretrained(model_path)


# FastAPI App
app = FastAPI()

# Request Body Model
class ComplaintRequest(BaseModel):
    text: str  # The complaint text

# Prediction function
def predict_severity(text):
    inputs = tokenizer(text, truncation=True, padding=True, return_tensors="pt")
    with torch.no_grad():  # Disable gradients for efficient inference
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()
    return prediction

# API Endpoint
@app.post("/predict/")
async def predict(request: ComplaintRequest):
    severity = predict_severity(request.text)
    return {"severity": severity}

