from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Tech Nation Application Tool API",
    description="Backend API for Tech Nation visa application preparation tool",
    version="1.0.0"
)

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Tech Nation Application Tool API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import routers
from app.api import criteria, documents, classification, achievements, evidence

app.include_router(criteria.router, prefix="/api/criteria", tags=["criteria"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(classification.router, prefix="/api/classification", tags=["classification"])
app.include_router(evidence.router, prefix="/api/evidence", tags=["evidence"])

# Additional routers will be added as they are created
# from app.api import auth, documents, classification, assembly, export
# app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
# app.include_router(classification.router, prefix="/api/classification", tags=["classification"])
# app.include_router(assembly.router, prefix="/api/assembly", tags=["assembly"])
# app.include_router(export.router, prefix="/api/export", tags=["export"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

