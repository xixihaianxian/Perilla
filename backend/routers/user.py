from fastapi import APIRouter,Depends,status
from config import database_config
from sqlalchemy.ext.asyncio import AsyncSession
from schema.user import UserRequest,UserAuthResponse,UserInfoResponse,UserLoginRequest,UserLoginResponse,UserLoginAuthResponse,CurrentUserResponse,UserDetailInfo,UserDetailInfoResponse
from crud.user import get_user_by_name,create_user,create_token,authenticate_user,fetch_user_info_by_token
from fastapi.exceptions import HTTPException
import uuid
from utils import response
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

router=APIRouter(prefix="/api/user",tags=["user"])

@router.post("/register")
async def register(user_info:UserRequest,db:AsyncSession=Depends(database_config.get_session_orm)):
    # 判断用户是否存在
    result=await get_user_by_name(user_info.name,db=db)
    if result is None:
        new_user=await create_user(db=db,user_info=user_info)
        token = await create_token(db=db,user_id=new_user.id)
        # return {
        #     "code":200,
        #     "message":"success register",
        #     "data":{
        #         "token":token,
        #         "userInfo":{
        #             "name":user_info.name,
        #             "nickname":user_info.nickname,
        #             "email":user_info.email,
        #             "phone":user_info.phone,
        #             "gender":user_info.gender,
        #         }
        #     }
        # }
        # model_validate将原本的数据转化为pydantic对象
        response_data=UserInfoResponse.model_validate(new_user)
        return response.success_response(data=UserAuthResponse(token=token,user_info=response_data))
    else:
        # return {
        #     "code":400,
        #     "message":"failure",
        #     "data":"The user already exists!"
        # }
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="The user already exists!")

@router.post("/login")
async def login(user_info:UserLoginRequest,db:AsyncSession=Depends(database_config.get_session_orm)):
    authenticate,user=await authenticate_user(db=db,name_or_email=user_info.name_or_email,password=user_info.password)
    if authenticate:
        token=await create_token(db=db,user_id=user.id)
        response_data=UserLoginResponse.model_validate(user)
        return response.success_response(data=UserLoginAuthResponse(token=token,user_info=response_data))
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Wrong username or password")


@router.post("/me")
async def fetch_me(token:OAuth2PasswordBearer=Depends(oauth2_scheme),db:AsyncSession=Depends(database_config.get_session_orm)):
    user_info=await fetch_user_info_by_token(token=token,db=db)
    if user_info is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please log in again!")
    else:
        response_data=UserLoginResponse.model_validate(user_info)
        return response.success_response(data=CurrentUserResponse(user_info=response_data))

@router.get("/info")
async def get_user_info(token:OAuth2PasswordBearer=Depends(oauth2_scheme),db:AsyncSession=Depends(database_config.get_session_orm)):
    user_info=await fetch_user_info_by_token(token=token,db=db)
    if user_info is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please log in again!")
    else:
        response_data=UserDetailInfo.model_validate(user_info)
        return response.success_response(data=UserDetailInfoResponse(user_info=response_data))

@router.patch("/update")
async def update_user_info():
    pass