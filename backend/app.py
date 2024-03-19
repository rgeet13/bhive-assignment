from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import dotenv_values
from typing import List, Optional
import httpx
import uvicorn

app = FastAPI()

# Load environment variables
env = dotenv_values(".env")

# Dummy user credentials
dummy_username = env.get("USERNAME")
dummy_password = env.get("PASSWORD")

def authenticate_user(username: str, password: str):
    if username == dummy_username and password == dummy_password:
        return True
    return False

@app.get("/api/mutual-fund-data/")
async def get_mutual_fund_data(fund_family: Optional[str] = None):
    url = "https://latest-mutual-fund-nav.p.rapidapi.com/fetchLatestNAV"
    headers = {
        "X-RapidAPI-Key": env.get("RAPIDAPI_KEY"),
        "Content-Type": "application/json",
    }
    if fund_family:
        print(f"Fund Family: {fund_family}")
        params = {
            "SchemeType": "Open Ended Schemes",
            "MutualFundFamily": fund_family,
        }
    else:
        params = {
            "SchemeType": "Open Ended Schemes"
        }
        print("No fund family specified", fund_family)
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        return response.json()

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)