from fastapi import FastAPI
from routes import router

app = FastAPI(
    title="FMCH ML Service",
    description="ML and decision-support service for the FMCH platform",
    version="1.0.0",
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "FMCH ML Service is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }