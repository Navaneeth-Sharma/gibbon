from typing import Dict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import gzip
import clickhouse_connect

# Create a connection to the ClickHouse server
client = clickhouse_connect.get_client(host="localhost", port=8123)

app = FastAPI()
origins = ["http://localhost:5173", "*", "http://127.0.0.1:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/event")
async def post_event(request: Request):
    if request.headers.get("Content-Encoding") == "gzip":
        body_bytes = await request.body()
        decompressed_data = gzip.decompress(body_bytes).decode("utf-8")
        body = json.loads(decompressed_data)
        
        json_ = json.dumps({"core": body["events"]})
        if body["events"]:
            # Extract country and user from the first event in the list
            first_event = body["events"][0]
            country = first_event.get("country", "Unknown")
            user = first_event.get("user", "Unknown")
            
            client.query(
                f"""
                    INSERT INTO gibbon_core.events (uuid, session_id, timestamp, user_id, country, browser, device, event) VALUES
                    (generateUUIDv4(), '{body['sessionId']}', now(), '{user}', '{country}', '{body['browser']}', '{body['device']}', '{json_}' ),
                """
            )
    else:
        body = await request.json()

    print(body)
    return {"message": "Event received", "data": body}
