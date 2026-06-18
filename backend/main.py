from fastapi import FastAPI
from routers import recommend,user
from fastapi.middleware.cors import CORSMiddleware
from utils import abnormal

app=FastAPI()

abnormal.register_exception_handler(app=app)

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
app.include_router(user.router)