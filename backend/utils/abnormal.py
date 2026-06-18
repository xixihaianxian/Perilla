from fastapi.exceptions import HTTPException
from fastapi import Request,status,FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError,SQLAlchemyError
import traceback


DEBUG_MODE=True

# http异常处理
async def http_exception_handler(request:Request,exc:HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code":exc.status_code,
            "message":exc.detail,
            "data":None
        }
    )

# 数据库异常处理
async def integrity_error_handler(request:Request,exc:IntegrityError):
    error_massage=str(exc.orig)
    if "username_UNIQUE" in error_massage or "Duplicate entry" in error_massage:
        detail="The user already exists"
    elif "FOREIGN KEY" in error_massage:
        detail="Related data does not exist"
    else:
        detail="Data constraint conflict"
    error_data=None
    if DEBUG_MODE:
        error_data={
            "error_type":"IntegrityError",
            "error_detail":error_massage,
            "path":str(request.url)
        }
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "code":400,
            "massage":detail,
            "data":error_data
        }
    )

# sqlalchemy异常处理
async def sqlalchemy_error_handler(request:Request,exc:SQLAlchemyError):
    error_data=None
    if DEBUG_MODE:
        error_data={
            "error_type":type(exc).__name__,
            "error_detail":str(exc),
            "traceback":traceback.format_exc(),
            "path":str(request.url)
        }
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code":500,
            "massage":"Database operation failed",
            "data":error_data
        }
    )

# 其他异常处理
async def general_exception_handler(request:Request,exc:Exception):
    error_data=None
    if DEBUG_MODE:
        error_data={
            "error_type":type(exc).__name__,
            "error_detail":str(exc),
            "traceback":traceback.format_exc(),
            "path":str(request.url)
        }
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_data,
    )

# fastapi异常注册
def register_exception_handler(app:FastAPI):
    app.add_exception_handler(exc_class_or_status_code=HTTPException,handler=http_exception_handler)
    app.add_exception_handler(exc_class_or_status_code=IntegrityError,handler=integrity_error_handler)
    app.add_exception_handler(exc_class_or_status_code=SQLAlchemyError,handler=sqlalchemy_error_handler)
    app.add_exception_handler(exc_class_or_status_code=Exception,handler=general_exception_handler)
