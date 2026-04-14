from pydantic import BaseModel, EmailStr


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: str
