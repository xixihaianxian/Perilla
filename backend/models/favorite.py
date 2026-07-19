from sqlalchemy import Integer,BigInteger,ForeignKey,DateTime,String,Text
from sqlalchemy.orm import DeclarativeBase,mapped_column,Mapped
from utils.table_base import Base
from datetime import datetime
from typing import Optional

class Favorite(Base):
    __tablename__ = 'favorite'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey('user.id', onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False
    )
    topic_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey('topic.id', onupdate='CASCADE', ondelete='CASCADE'),
        unique=True,  # 对应SQL中的 unique 约束
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now
    )

class UpdateStartLog(Base):
    __tablename__ = 'update_start_log'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    topic_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey('topic.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    control: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )
    detail: Mapped[Optional[str]] = mapped_column(
        Text,
        default=None,
        nullable=True
    )

    def __repr__(self):
        return f"<UpdateStartLog(id={self.id}, user_id={self.user_id}, topic_id={self.topic_id}, control={self.control})>"