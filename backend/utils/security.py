from passlib.context import CryptContext
import uuid

pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# 密码加密
def get_hash_password(password:str):
    return pwd_context.hash(password)

# 密码校验
def verify_password(hash_password:str,password:str):
    return pwd_context.verify(secret=password,hash=hash_password)

# 创建token
def new_token():
    token=str(uuid.uuid4())
    return token

if __name__=="__main__":
    password="1433223yu"
    print(get_hash_password(password))