from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from predict import run_prediction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    drugs: list[str]

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    return run_prediction(req.drugs)