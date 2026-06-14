from sqlalchemy.orm import sessionmaker,mapped_column,Mapped
from sqlalchemy.ext.asyncio import AsyncSession,create_async_engine
import os
from dotenv import load_dotenv

load_dotenv(".env")

engine=create_async_engine(
    url=os.getenv("DATASET_URL"),
    echo=os.getenv("ECHO").lower()=="true",
    pool_size=int(os.getenv("POOL_SIZE")),
    max_overflow=int(os.getenv("MAX_OVERFLOW")),
)

session_orm=sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_session_orm():
    async with session_orm() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()