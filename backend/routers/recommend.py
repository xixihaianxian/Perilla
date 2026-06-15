from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from config import database_config
from sqlalchemy import select
from models.recommend import Categories
from crud import recommend
from fastapi.exceptions import HTTPException

router=APIRouter(prefix="/api/recommend",tags=["recommend"])

@router.get("/categories")
async def categories(db:AsyncSession=Depends(database_config.get_session_orm)):
    stmt=select(Categories.id,Categories.name)
    result=await db.execute(stmt)
    id_categories=result.mappings().all()
    return {
        "code":200,
        "message":"successful",
        "categories":id_categories
    }

@router.get("/topic")
async def topic(page:int, page_size:int, category_id:int ,db:AsyncSession=Depends(database_config.get_session_orm)):
    topics=await recommend.fetch_topic(db=db,page=page,category_id=category_id,page_size=page_size)
    total_topic_count=await recommend.fetch_topic_number(db=db,category_id=category_id)
    obtain_number=len(topics)+(page-1)*page_size
    if total_topic_count-obtain_number>0:
        hash_more=True
    else:
        hash_more=False
    return {
        "code":200,
        "message":"successful",
        "data":{
            "topics":topics,
            "total":total_topic_count,
            "hashMore":hash_more
        }
    }

@router.get("/topic/detail")
async def detail(topic_id:int,db:AsyncSession=Depends(database_config.get_session_orm)):
    topic_detail=await recommend.fetch_topic_detail(topic_id=topic_id,db=db)
    if topic_detail is None:
        return {
            "code":404,
            "message":"failure",
            "data":"The topic has been deleted"
        }
    else:
        return {
            "code":200,
            "message":"success",
            "data":{
                "id":topic_id,
                "title":topic_detail.title,
                "content":topic_detail.description,
                "author":topic_detail.username,
                "publish_time":topic_detail.created_at,
                "bio":topic_detail.bio,
            }
        }

@router.get("/topic/starts_views")
async def starts_views(topic_id:int,db:AsyncSession=Depends(database_config.get_session_orm)):
    topic_start_views=await recommend.fetch_view_start(topic_id=topic_id,db=db)
    update_views_result=await recommend.update_views(db=db,topic_id=topic_id)
    if topic_start_views is None or not update_views_result:
        return {
            "code": 404,
            "message": "failure",
            "data": "The topic has been deleted"
        }
    else:
        return {
            "code":200,
            "message":"success",
            "data":topic_start_views
        }

@router.get("/topic/media")
async def media(topic_id:int,db:AsyncSession=Depends(database_config.get_session_orm)):
    topic_media=await recommend.fetch_topic_media(db=db,topic_id=topic_id)
    if topic_media is None:
        return {
            "code":404,
            "message":"failure",
            "data":"The topic has been deleted",
        }
    else:
        return {
            "code":200,
            "message":"success",
            "data":topic_media,
        }