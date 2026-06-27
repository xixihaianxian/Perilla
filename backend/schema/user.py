from pydantic import BaseModel,Field,ConfigDict
from typing import Optional
from datetime import date

# 用户注册时需要填写的信息
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

class UserDetailInfo(BaseModel):
    nickname:str=Field(...,max_length=50)
    # email:str=Field(...,max_length=100)
    # phone:str=Field(...,max_length=20)
    bio:Optional[str]=Field(default=None,max_length=500)
    gender:int=Field(...,ge=0,le=2)
    avatar:Optional[str]=Field(default=None,max_length=500)
    status:Optional[int]=Field(default=None)
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class UserAuthResponse(BaseModel):
    token:str
    user_info:UserInfoResponse=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
    model_config = ConfigDict(
        populate_by_name=True, # alias和字段兼容
        from_attributes=True, # 允许从ORM对象中获取值
    )

# 用户登录时需要填写的信息
class UserLoginRequest(BaseModel):
    name_or_email:str
    password:str


class UserLoginResponse(BaseModel):
    username:str=Field(...,max_length=50)
    avatar:str=Field(...,max_length=500)
    nickname:str=Field(...,max_length=50)
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class UserLoginAuthResponse(BaseModel):
    token:str
    user_info:UserLoginResponse=Field(...,validation_alias="UserInfo",serialization_alias="UserInfo")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class CurrentUserResponse(BaseModel):
    user_info:UserLoginResponse=Field(...,validation_alias="UserInfo",serialization_alias="UserInfo")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class UserDetailInfoResponse(BaseModel):
    user_info:UserDetailInfo=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

# class UserSatus(BaseModel):
#     status:Optional[int]=Field(default=None)
#     model_config = ConfigDict(
#         from_attributes=True,
#         populate_by_name=True,
#     )
#
# class UserStatusInfoResponse(BaseModel):
#     user_info:UserSatus=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
#     model_config = ConfigDict(
#         from_attributes=True,
#         populate_by_name=True,
#     )

# 用户资料信息
class UserInformation(BaseModel):
    nickname:str=Field(max_length=50)
    bio:str=Field(max_length=500)
    gender:int=Field(ge=0,le=2)
    birthday:date
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class UserInformationResponse(BaseModel):
    token:str
    user_info:UserInformation=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

# 用户账号信息
class UserAccountInfo(BaseModel):
    username:str=Field(max_length=50)
    email:str=Field(max_length=100)
    phone:str=Field(max_length=20)
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class UserAccountInfoResponse(BaseModel):
    token:str
    user_info:UserAccountInfo=Field(...,validation_alias="userInfo",serialization_alias="userInfo")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )