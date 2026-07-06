from fastapi import APIRouter,Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from config import database_config
from crud import favorite as crud_favorite
from schema import favorite as schema_favorite
from utils import response

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