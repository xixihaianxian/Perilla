from pydantic import BaseModel,Field
from pydantic.config import ConfigDict
from typing import List

class FavoriteMethod(BaseModel):
    topic_id:int
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class FavoriteMethodResponse(BaseModel):
    token:str
    favorite_method:FavoriteMethod=Field(...,validation_alias="favoriteMethod",serialization_alias="favoriteMethod")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class ExhibitFavoriteResponse(BaseModel):
    token:str
    exhibit:List[int]=Field(default=None,validation_alias="exhibit",serialization_alias="exhibit")
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

# 更新收藏表需要接收的数据
class UpdateTopicStartRequest(BaseModel):
    topic_id:int
    method:str=Field(default="cancel")