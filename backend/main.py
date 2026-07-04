from fastapi import FastAPI
from routers import recommend,user,favorite
from fastapi.middleware.cors import CORSMiddleware
from utils import abnormal
from fastapi.staticfiles import StaticFiles

app=FastAPI()

abnormal.register_exception_handler(app=app)

app.mount(
    path="/static",
    app=StaticFiles(directory="static"),
    name="static"
)

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
app.include_router(favorite.router)