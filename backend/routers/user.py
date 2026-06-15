from fastapi import APIRouter,Depends
from config import database_config
from sqlalchemy.ext.asyncio import AsyncSession
from schema import user

router=APIRouter(prefix="/api/user",tags=["user"])

@router.post("/register")
async def register(user_info:user.UserRequest,db:AsyncSession=Depends(database_config.get_session_orm)):
    return {
        "code":200,
        "message":"success register",
        "data":{
            "token":"token",
            "userInfo":{
                "name":user_info.name,
            }
        }
    }