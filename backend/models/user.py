from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,relationship
from sqlalchemy import BigInteger,ForeignKey,String,DateTime,func,Index,Integer
from typing import Optional
from datetime import datetime
from utils.table_base import Base

# 基类
# class Base(DeclarativeBase):
#     pass

# 构建user_token
class UserToken(Base):

    __tablename__ = 'user_token'

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'),
        unique=True
    )
    token: Mapped[str] = mapped_column(String(200), unique=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        default=None,
        comment='过期时间，和创建时间相差7天'
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    __table_args__ = (
        Index('idx_user_id', 'user_id'),
    )

class Status(Base):
    __tablename__ = 'status'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(10), nullable=False)

    def __repr__(self):
        return f"<Status(id={self.id}, name={self.name})>"