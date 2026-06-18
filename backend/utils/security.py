from passlib.context import CryptContext
import uuid
from jose import jwt
from datetime import datetime,timedelta
import yaml
from pathlib import Path

pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# 密码加密
def get_hash_password(password:str):
    return pwd_context.hash(password)

# 密码校验
def verify_password(hash_password:str,password:str)->bool:
    return pwd_context.verify(secret=password,hash=hash_password)

# 创建token
def new_token():
    token=str(uuid.uuid4())
    return token

# 创建token的新方法
def create_access_token(user_id:int):
    config_path=Path(__file__).resolve().parent.parent/"config"/"config.yaml"
    with open(config_path,"r",encoding="utf-8") as file:
        config=yaml.safe_load(file)
    secret_key = config["SECRET_KEY"]
    algorithm = config["ALGORITHM"]
    expire = datetime.now() + timedelta(days=7)
    payload={
        "sub":str(user_id),
        "expire":expire.strftime("%Y-%m-%d %H:%M:%S")
    }
    token=jwt.encode(
        claims=payload,
        key=secret_key,
        algorithm=algorithm,
    )
    return token

if __name__=="__main__":
    pass