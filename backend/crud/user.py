from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import recommend,user
from schema.user import UserRequest
from utils import security
from datetime import datetime,timedelta

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
    new_user=recommend.User(username=user_info.name,
                            nickname=user_info.nickname,
                            password_hash=encryption_password,
                            phone=user_info.phone,
                            email=user_info.email,
                            gender=user_info.gender)
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
        user_token.token=token
        user_token.expires_at=expires_at
        user_token.created_at=datetime.now()
    # 添加token
    else:
        user_token=user.UserToken(user_id=user_id,token=token,expires_at=expires_at)
        db.add(user_token)
        await db.commit()
    # 返回token
    return token