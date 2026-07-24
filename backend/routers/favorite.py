from fastapi import APIRouter,Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from config import database_config
from crud import favorite as crud_favorite
from schema import favorite as schema_favorite
from utils import response
from fastapi.exceptions import HTTPException
from  fastapi import status

oauth2_scheme=OAuth2PasswordBearer("/api/user/login")

router=APIRouter(prefix="/api/favorite",tags=["favorite"])

@router.post("/proactive/collection")
async def proactive_collection(topic_id:int,token:OAuth2PasswordBearer=Depends(oauth2_scheme),db:AsyncSession=Depends(database_config.get_session_orm)):
    data,method=await crud_favorite.update_favorite_info(topic_id=topic_id,token=token,db=db)
    response_data=schema_favorite.FavoriteMethod.model_validate(data)
    return response.favorite_response(
        method=method,
        data=schema_favorite.FavoriteMethodResponse(token=token,favorite_method=response_data)
    )

# 收藏展示
@router.get("/exhibit/collect/topics")
async def exhibit_collect_topics(token:OAuth2PasswordBearer=Depends(oauth2_scheme),db:AsyncSession=Depends(database_config.get_session_orm)):
    favorite_topics_id=await crud_favorite.fetch_collect_topics_id(token=token,db=db)
    return response.success_response(
        data=schema_favorite.ExhibitFavoriteResponse(
            token=token,
            exhibit=favorite_topics_id,
        )
    )

# 更新收藏次数
@router.patch("/update/favorite/number")
async def update_favorite_number(token:OAuth2PasswordBearer=Depends(oauth2_scheme),control:schema_favorite.UpdateTopicStartRequest=None,db:AsyncSession=Depends(database_config.get_session_orm)):
    if control is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Request failed!")
    else:
        update_response=await crud_favorite.update_start(token=token,control=control,db=db)
        return response.success_response(
            data=update_response.model_dump()
        )