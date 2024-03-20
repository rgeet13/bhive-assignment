from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import dotenv_values
from typing import List, Optional
import httpx
import uvicorn
import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8000",
    # Add more allowed origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Load environment variables
env = dotenv_values(".env")

# Secret key for encoding and decoding JWT tokens
SECRET_KEY = env.get("SECRET_KEY")

# Dummy user credentials
dummy_username = env.get("USERNAME")
dummy_password = env.get("PASSWORD")

def authenticate_user(username: str, password: str):
    if username == dummy_username and password == dummy_password:
        return True
    return False
TOKEN_EXPIRATION = timedelta(minutes=30)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    """Create a new JWT token with the provided data."""
    to_encode = data.copy()
    expire = datetime.utcnow() + TOKEN_EXPIRATION
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@app.post("/token/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint to generate a new JWT token."""
    username = form_data.username
    password = form_data.password
    if authenticate_user(username, password):
        return {"access_token": create_access_token({"sub": username})}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

@app.get("/api/mutual-fund-data/")
async def get_mutual_fund_data(fund_family: Optional[str] = None, token: str = Depends(oauth2_scheme)):
    url = "https://latest-mutual-fund-nav.p.rapidapi.com/fetchLatestNAV"
    headers = {
        "X-RapidAPI-Key": env.get("RAPIDAPI_KEY"),
        "Content-Type": "application/json",
    }
    if fund_family:
        data = await fetch_fund_family_data()
        if fund_family not in data:
            raise HTTPException(status_code=404, detail=f"Fund family: {fund_family} not found")
        params = {
            "SchemeType": "Open Ended Schemes",
            "MutualFundFamily": fund_family,
        }
    else:
        params = {
            "SchemeType": "Open Ended Schemes"
        }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        return response.json()

@app.get("/api/fund-family/")
async def get_fund_families(token: str = Depends(oauth2_scheme)):
    fund_family_data = await fetch_fund_family_data()
    return fund_family_data

async def fetch_fund_family_data():
    url = 'https://latest-mutual-fund-nav.p.rapidapi.com/fetchAllMutualFundFamilies'
    headers = {
        "X-RapidAPI-Key": env.get("RAPIDAPI_KEY"),
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        return response.json()
if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)