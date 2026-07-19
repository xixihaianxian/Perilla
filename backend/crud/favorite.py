from sqlalchemy import select,delete,and_,update
from models import user,recommend,favorite
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError,SQLAlchemyError
from typing import List
from  datetime import datetime,timedelta
from utils import security
from schema import favorite as schema_favorite

# 判断token是否过期
async def judgment_token(token:OAuth2PasswordBearer,db:AsyncSession):
    now_time=datetime.now()
    # new_expires_at=now_time+timedelta(days=7)
    # new_token=security.new_token()
    stmt=select(
        user.UserToken.expires_at,
        user.UserToken.user_id,
    ).where(user.UserToken.token==token)
    result=await db.execute(stmt)
    token_row=result.first()
    # 用户不存在
    if token_row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please sign up!")
    else:
        # token没有过期,返回user_id
        if token_row.expires_at>now_time:
            return token_row.user_id
        # token过期
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please log in again!")

async def get_user_id_by_token(token:OAuth2PasswordBearer,db:AsyncSession):
    # 判断token是否过期
    user_id=await judgment_token(token=token,db=db)
    # stmt=select(
    #     recommend.User.id
    # ).join(
    #     user.UserToken,
    #     user.UserToken.user_id==recommend.User.id,
    # ).where(
    #     user.UserToken.token==token
    # )
    # result=await db.execute(stmt)
    # user_id=result.scalar_one_or_none()
    # if user_id is None:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Please log in again!")
    # else:
    return user_id

async def update_favorite_info(topic_id:int,token:OAuth2PasswordBearer,db:AsyncSession):
    user_id=await get_user_id_by_token(token=token,db=db)
    favorite_info=favorite.Favorite(
        user_id=user_id,
        topic_id=topic_id,
    )
    db.add(favorite_info)
    try:
        await db.commit()
        await db.refresh(favorite_info)
        return favorite_info,"favorite"
    except IntegrityError as error:
        await db.rollback()
        delete_query=delete(
            favorite.Favorite
        ).where(
            and_(favorite.Favorite.topic_id==topic_id,
                 favorite.Favorite.user_id==user_id
                 )
        )
        search_query=select(
            favorite.Favorite
        ).where(
            and_(favorite.Favorite.topic_id==topic_id,
                 favorite.Favorite.user_id==user_id
                 )
        )
        favorite_info=await db.execute(search_query)
        favorite_info=favorite_info.scalars().first()
        await db.execute(delete_query)
        return favorite_info,"cancel"
    except SQLAlchemyError as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="The server's acting up!")

# 获取收藏话题的id
async def fetch_collect_topics_id(token:OAuth2PasswordBearer,db:AsyncSession):
    user_id=await get_user_id_by_token(token=token,db=db)
    stmt=select(
        favorite.Favorite.topic_id
    ).where(
        favorite.Favorite.user_id==user_id
    )
    result=await db.execute(stmt)
    # 返回一个列表
    favorite_topics=result.scalars().all()
    return favorite_topics

# 更新收藏表
async def update_start(token:OAuth2PasswordBearer,control:schema_favorite.UpdateTopicStartRequest,db:AsyncSession):
    user_id=await judgment_token(token=token,db=db)
    topic_id = control.topic_id
    # 日志内容
    update_log = favorite.UpdateStartLog(
        user_id=user_id,
        topic_id=topic_id,
        control=control.method,
        detail=f"user {user_id} {control.method} topic {topic_id}"
    )
    # 收藏时的操作
    if control.method=="favorite":
        stmt=update(
            recommend.TopicStartBrowser
        ).where(
            recommend.TopicStartBrowser.note_id==topic_id
        ).values(
            start=recommend.TopicStartBrowser.start+1
        )
        result=await db.execute(statement=stmt)
        if result.rowcount==0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Server error")
        else:
            db.add(update_log)
            await db.commit()
            await db.refresh(update_log)
            return schema_favorite.StartUpdateResponse(
                user=user_id,
                topic=topic_id,
                method=control.method,
                token=token,
            )
    # 取消收藏时的操作
    else:
        stmt=update(
            recommend.TopicStartBrowser
        ).where(
            recommend.TopicStartBrowser.note_id==topic_id
        ).values(
            start=recommend.TopicStartBrowser.start-1
        )
        result=await db.execute(statement=stmt)
        if result.rowcount==0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Server error")
        else:
            db.add(update_log)
            await db.commit()
            await db.refresh(update_log)
            return schema_favorite.StartUpdateResponse(
                user=user_id,
                topic=topic_id,
                method=control.method,
                token=token
            )