from fastapi import APIRouter,Depends,status
from config import database_config
from sqlalchemy.ext.asyncio import AsyncSession
from schema.user import UserRequest
from crud.user import get_user_by_name,create_user,create_token
from fastapi.exceptions import HTTPException
import uuid

router=APIRouter(prefix="/api/user",tags=["user"])

@router.post("/register")
async def register(user_info:UserRequest,db:AsyncSession=Depends(database_config.get_session_orm)):
    # 判断用户是否存在
    result=await get_user_by_name(user_info.name,db=db)
    if result is None:
        new_user=await create_user(db=db,user_info=user_info)
        token = await create_token(db=db,user_id=new_user.id)
        return {
            "code":200,
            "message":"success register",
            "data":{
                "token":token,
                "userInfo":{
                    "name":user_info.name,
                    "nickname":user_info.nickname,
                    "email":user_info.email,
                    "phone":user_info.phone,
                    "gender":user_info.gender,
                }
            }
        }
    else:
        # return {
        #     "code":400,
        #     "message":"failure",
        #     "data":"The user already exists!"
        # }
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="The user already exists!")