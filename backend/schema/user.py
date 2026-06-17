from pydantic import BaseModel,Field,ConfigDict
from typing import Optional

class UserRequest(BaseModel):
    name:str
    password:str
    nickname:str
    phone:str
    email:str
    gender:int

# 基础信息，一些可以不用填写的信息
class UserInfoBase(BaseModel):
    avatar:Optional[str]=Field(None,max_length=500)
    bio:Optional[str]=Field(None,max_length=500)

class UserInfoResponse(UserInfoBase):
    r"""
    用户基础信息
    """
    username:str=Field(...,max_length=50)
    nickname:str=Field(...,max_length=50)
    phone:str=Field(...,max_length=20)
    email:str=Field(...,max_length=100)
    gender:int=Field(...,ge=0,le=2)

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class UserAuthResponse(BaseModel):
    token:str
    user_info:UserInfoResponse=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
    model_config = ConfigDict(
        populate_by_name=True, # alias和字段并兼容
        from_attributes=True, # 允许从ORM对象中获取值
    )