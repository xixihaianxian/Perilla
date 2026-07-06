from pydantic import BaseModel,Field
from pydantic.config import ConfigDict

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