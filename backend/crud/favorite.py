from sqlalchemy import select,delete,and_
from models import user,recommend,favorite
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError,SQLAlchemyError

async def get_user_id_by_token(token:OAuth2PasswordBearer,db:AsyncSession):
    stmt=select(
        recommend.User.id
    ).join(
        user.UserToken,
        user.UserToken.user_id==recommend.User.id,
    ).where(
        user.UserToken.token==token
    )
    result=await db.execute(stmt)
    user_id=result.scalar_one_or_none()
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Please log in again!")
    else:
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