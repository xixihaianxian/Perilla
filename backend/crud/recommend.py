from sqlalchemy import select,func,update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from config import database_config
from models.recommend import Topic,User,TopicStartBrowser

# 获取topic
async def fetch_topic(db:AsyncSession,page:int=0,page_size:int=10,category_id:int=0):
    offset=(page-1)*page_size
    limit=page_size
    if category_id==0:
        stmt=(
            select(Topic.id,Topic.cover_url,Topic.title,User.username,User.avatar)
            .select_from(Topic)
            .outerjoin(User,Topic.author_id==User.id)
            .limit(limit)
            .offset(offset)
        )
        result=await db.execute(stmt)
    else:
        stmt = (
            select(Topic.id,Topic.cover_url,Topic.title,User.username,User.avatar)
            .select_from(Topic)
            .outerjoin(User, Topic.author_id == User.id)
            .where(Topic.category_id == category_id)
            .limit(limit)
            .offset(offset)
        )
        result=await db.execute(stmt)
    topics=result.mappings().all()
    return topics

# 获取topic数量
async def fetch_topic_number(db:AsyncSession,category_id:int):
    if category_id==0:
        stmt=select(func.count(Topic.id))
    else:
        stmt=select(func.count(Topic.id)).where(Topic.category_id==category_id)
    result=await db.execute(stmt)
    count=result.scalar_one()
    return count

async def fetch_topic_detail(db:AsyncSession,topic_id:int):
    stmt=select(
        Topic.author_id,
        Topic.description,
        Topic.title,
        Topic.created_at,
        User.username,
        User.bio,
    ).select_from(Topic).join(target=User,onclause=User.id==Topic.author_id).where(Topic.id==topic_id)
    result=await db.execute(stmt)
    detail=result.mappings().first()
    return detail

async def fetch_view_start(db:AsyncSession,topic_id:int):
    stmt = select(
        TopicStartBrowser.start,
        TopicStartBrowser.browser
    ).select_from(Topic).outerjoin(
        TopicStartBrowser,
        TopicStartBrowser.note_id == Topic.id
    ).where(Topic.id == topic_id)
    result=await db.execute(stmt)
    starts_views=result.mappings().first()
    return starts_views

# 增加浏览量
async def update_views(db:AsyncSession,topic_id:int):
    stmt=update(TopicStartBrowser).where(TopicStartBrowser.note_id==topic_id).values(browser=TopicStartBrowser.browser+1)
    result=await db.execute(stmt)
    await db.commit()
    # 获取修改命中的数据数
    return result.rowcount>0