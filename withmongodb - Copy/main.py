from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers.router import recommendation_router, search_router, booking_router
from database.Database import connect_to_mongo, close_mongo_connection
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events"""
    # Startup
    print(" Starting up...")
    await connect_to_mongo()
    yield
    # Shutdown
    print(" Shutting down...")
    await close_mongo_connection()

# Initialize FastAPI app
app = FastAPI(
    title="Restaurant Recommendation & Booking API",
    description="API for restaurant recommendations, search, and bookings with MongoDB",
    version="2.0.0",
    lifespan=lifespan
)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, chỉ định cụ thể domain của frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recommendation_router)
app.include_router(search_router)
app.include_router(booking_router)

@app.get("/")
async def root():
    return {
        "message": "Restaurant Recommendation & Booking API",
        "version": "2.0.0",
        "database": "MongoDB",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# kiem tra trang thai API va ket noi co so du lieu 
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from database.Database import get_database
    try:
        db = get_database()
        is_connected = await db.ping()
        
        return {
            "status": "healthy" if is_connected else "unhealthy",
            "database": "connected" if is_connected else "disconnected",
            "message": "API is running"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print(" Khởi động Restaurant Recommendation API")
    print("=" * 60)
    print(" Database: MongoDB")
    print(" Server: http://localhost:8000")
    print(" Docs: http://localhost:8000/docs")
    print("  Health: http://localhost:8000/health")
    print("=" * 60)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )