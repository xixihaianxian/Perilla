from sqlalchemy import Integer,BigInteger,ForeignKey,DateTime
from sqlalchemy.orm import DeclarativeBase,mapped_column,Mapped
from utils.table_base import Base
from datetime import datetime

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