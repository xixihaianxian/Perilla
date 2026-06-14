from fastapi import FastAPI
from routers import recommend
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return f"Hello world!"

app.include_router(recommend.router)