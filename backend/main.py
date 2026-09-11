"""FastAPI service used to test the Social Sandbox frontend integration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


SERVICE_NAME = "social-sandbox-backend-test"

app = FastAPI(title=SERVICE_NAME)

# Keep the primary integration test focused on detecting an incorrect backend
# host instead of failing because of a browser CORS policy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"service": SERVICE_NAME, "status": "ok"}


@app.get("/api/message")
async def message() -> dict[str, str]:
    return {
        "service": SERVICE_NAME,
        "message": "Hello from the Social Sandbox backend test service.",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8081)
