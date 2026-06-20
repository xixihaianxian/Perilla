from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import recommend,user
from schema.user import UserRequest
from utils import security
from datetime import datetime,timedelta
from config.setting import AvatarSetting
import os
import random

# 根据用户名获取用户
async def get_user_by_name(username:str,db:AsyncSession):
    stmt=select(recommend.User).where(recommend.User.username==username)
    result=await db.execute(stmt)
    data=result.scalar_one_or_none()
    return data

# 创建用户，用于保存用户
async def create_user(db:AsyncSession,user_info:UserRequest):
    password=user_info.password
    encryption_password=security.get_hash_password(password=password)
    avatar_setting=AvatarSetting()
    default_avatar_path=avatar_setting.DEFAULT_AVATAR_DIR
    default_avatar_names=os.listdir(default_avatar_path)
    default_avatar_name=random.choice(default_avatar_names)
    default_avatar_path=os.path.join("avatars","robot",default_avatar_name)
    new_user=recommend.User(username=user_info.name,
                            nickname=user_info.nickname,
                            password_hash=encryption_password,
                            phone=user_info.phone,
                            email=user_info.email,
                            gender=user_info.gender,
                            avatar=default_avatar_path)
    db.add(new_user)
    await db.commit()
    # 使用最新的内容覆盖掉内存中的new_user
    # 最新的内容是根据new_user里的主键来查询的
    await db.refresh(new_user)
    return new_user

# 创建token
async def create_token(db:AsyncSession,user_id:int):
    token=security.new_token()
    expires_at=datetime.now()+timedelta(days=7)
    stmt=select(user.UserToken).where(user.UserToken.user_id==user_id)
    result=await db.execute(stmt)
    user_token=result.scalar_one_or_none()
    # 更新token
    if user_token is not None:
        # 判断是否过期
        if datetime.now()>user_token.expires_at:
            user_token.token=token
            user_token.expires_at=expires_at
            user_token.created_at=datetime.now()
        else:
            token=user_token.token
    # 添加token
    else:
        user_token=user.UserToken(user_id=user_id,token=token,expires_at=expires_at)
        db.add(user_token)
        await db.commit()
    # 返回token
    return token

# 判断用户是否存在
async def authenticate_user(db:AsyncSession,name_or_email,password)->tuple:
    # 根据用户名来判断
    stmt_by_name=select(recommend.User).where(recommend.User.username==name_or_email)
    result_by_name=await db.execute(stmt_by_name)
    user_by_name=result_by_name.scalar_one_or_none()
    # 更具邮箱来判断
    stmt_by_email=select(recommend.User).where(recommend.User.email==name_or_email)
    result_by_email=await db.execute(stmt_by_email)
    user_by_email=result_by_email.scalar_one_or_none()
    if user_by_name is not None:
        password_by_name = user_by_name.password_hash
        authenticate=security.verify_password(hash_password=password_by_name,password=password)
        return authenticate,user_by_name
    elif user_by_email is not None:
        password_by_email = user_by_email.password_hash
        authenticate=security.verify_password(hash_password=password_by_email,password=password)
        return authenticate,user_by_email
    else:
        return False,None

# 根据token查找用户信息
async def fetch_user_info_by_token(token:str,db:AsyncSession):
    stmt = select(
        recommend.User.username,
        recommend.User.nickname,
        recommend.User.avatar,
        recommend.User.bio,
        recommend.User.gender,
        user.UserToken.expires_at
    ).join(
        user.UserToken,
        user.UserToken.user_id == recommend.User.id
    ).where(
        user.UserToken.token == token
    )
    result=await db.execute(stmt)
    user_info=result.first()
    if user_info is None:
        return None
    if datetime.now()>user_info.expires_at:
        return None
    else:
        return user_info

if __name__=="__main__":
    pass