from sqlalchemy import Integer,DateTime,func,String,BigInteger,SmallInteger,Date,ForeignKey,Index,Enum
from sqlalchemy.orm import DeclarativeBase,mapped_column,Mapped
from datetime import datetime
from typing import Optional
from datetime import date
from utils.table_base import Base

class TimestampMixin:
    created_at:Mapped[datetime]=mapped_column(DateTime,default=func.now())
    updated_at:Mapped[datetime]=mapped_column(DateTime,default=func.now(),onupdate=func.now())

class Categories(Base,TimestampMixin):
    __tablename__ = "categories"
    id:Mapped[int]=mapped_column(Integer,primary_key=True,autoincrement=True)
    name:Mapped[str]=mapped_column(String(100),unique=True,nullable=False)


class User(Base,TimestampMixin):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    nickname: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    gender: Mapped[int] = mapped_column(SmallInteger, default=0)
    birthday: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[int] = mapped_column(SmallInteger, default=1)
    last_login_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, nickname={self.nickname})>"


class Topic(Base,TimestampMixin):
    __tablename__ = "topic"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    cover_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    author_id: Mapped[Optional[int]] = mapped_column(Integer,
                                                     ForeignKey("user.id", onupdate="SET NULL", ondelete="CASCADE"),
                                                     nullable=True)
    category_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("categories.id", onupdate="SET NULL",
                                                                              ondelete="CASCADE"), nullable=True)

    # 注意：created_at 和 updated_at 已经在 Base 中定义，这里不需要重复定义
    # 但 Base 中的字段名需要与表结构一致，如果不一致，需要覆盖定义

    __table_args__ = (
        Index("index_created_at", "created_at"),
        Index("index_categories_id", "category_id"),
    )

    def __repr__(self):
        return f"<Topic(id={self.id}, title={self.title}, author_id={self.author_id})>"


# 话题素材表
class TopicMedia(Base,TimestampMixin):
    __tablename__ = 'topic_media'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    note_id: Mapped[Optional[int]] = mapped_column(BigInteger,
                                                   ForeignKey('topic.id', ondelete='CASCADE', onupdate='CASCADE'))
    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    media_type: Mapped[str] = mapped_column(Enum('image', 'video', name='media_type_enum'), default='image')

    # created_at 和 updated_at 从 Base 继承


# 话题收藏浏览表
class TopicStartBrowser(Base,TimestampMixin):
    __tablename__ = 'topic_start_browser'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    note_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('topic.id', ondelete='CASCADE', onupdate='CASCADE'),
                                         nullable=False, unique=True)
    start: Mapped[Optional[int]] = mapped_column(BigInteger)
    browser: Mapped[Optional[int]] = mapped_column(BigInteger)


class TopicCommentsNumber(Base,TimestampMixin):
    __tablename__ = 'topic_comments_number'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    number: Mapped[Optional[int]] = mapped_column(BigInteger, default=0)
    topic_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('topic.id', ondelete='CASCADE', onupdate='CASCADE'),
                                          nullable=False)