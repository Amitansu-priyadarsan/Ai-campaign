from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.auth_controller import router as auth_router
from controllers.admin_controller import router as admin_router
from controllers.preferences_controller import router as preferences_router
from controllers.dashboard_controller import router as dashboard_router
from controllers.campaign_controller import router as campaign_router, campaigns_router
from controllers.chat_controller import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "AI Campaign Backend is running"}


app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(preferences_router)
app.include_router(dashboard_router)
app.include_router(campaign_router)
app.include_router(campaigns_router)
app.include_router(chat_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
