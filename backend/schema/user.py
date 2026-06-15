from pydantic import BaseModel,Field

class UserRequest(BaseModel):
    name:str
    password:str
    nickname:str
    phone:str
    email:str
    gender:int