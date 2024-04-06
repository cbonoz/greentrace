from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import APIKeyHeader, APIKeyQuery
from pydantic import BaseModel
from typing import Optional, Dict
from tinydb import TinyDB, Query
import uuid

app = FastAPI()

origins = [
    "https://vercel.app",
    "https://usegreentrace.vercel.app",
    "http://localhost",
    "http://localhost:3000",
]

# Enable cors
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["X-Api-Key", "api_key", "Content-Type", "Authorization"]
)

# Initialize TinyDB databases
db = TinyDB('database.json')
api_keys_db = TinyDB('api_keys.json')


# Security dependencies for API key
api_key_header = APIKeyHeader(name="X-Api-Key")


class KeyValuePayload(BaseModel):
    key: str
    # any type value
    value: Dict | str


def get_api_key(request: Request):
    api_key_header = request.headers.get("X-Api-Key")
    print('key info:', api_key_header)
    if api_keys_db.contains(Query().key == api_key_header):
        return api_key_header
    else:
        raise HTTPException(status_code=403, detail="Invalid API Key")


# Routes for setting, getting, and deleting key-value pairs
@app.post("/set")
async def set_key_value(data: KeyValuePayload, api_key: str = Depends(get_api_key)):
    db.insert({'key': data.key, 'value': data.value})
    return {"message": f"Key '{data.key}' set successfully."}


@app.get("/get")
async def get_value(key: str, api_key: str = Depends(get_api_key)):
    query_result = db.search(Query().key == key)
    if not query_result:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"key": key, "value": query_result[0]['value']}


@app.delete("/delete")
async def delete_key(key: str, api_key: str = Depends(get_api_key)):
    num_removed = db.remove(Query().key == key)
    if num_removed == 0:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"message": f"Key '{key}' deleted successfully."}


# Route for provisioning API keys for users
@app.post("/provision-api-key")
async def provision_api_key(user_id: str):
    api_key = str(uuid.uuid4().hex)
    # api_key = "generated_api_key_for_user_" + user_id
    api_keys_db.insert({'user_id': user_id, 'key': api_key})
    return {"api_key": api_key}

@app.get("/hello")
async def get_hello():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
