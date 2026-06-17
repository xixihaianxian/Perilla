from typing import Any
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

# 成功的响应函数
def success_response(message:str="success",data:Any=None):
    if hasattr(data,"model_dump"):
        data=data.model_dump(by_alias=True)
    content={
        "code":200,
        "message":message,
        "data":data
    }
    return JSONResponse(
        content=jsonable_encoder(content),
    )