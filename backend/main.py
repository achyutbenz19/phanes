from fastapi import FastAPI
from fastapi.websockets import WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from browser import BrowserAutomation
from typing import Optional

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3000/*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

active_prompt = ""
browser = None

@app.websocket("/ws")
async def websocket_ep(websocket: WebSocket, client_id: Optional[str] = None):
    global active_prompt
    global browser
    
    if client_id is None:
        client_id = websocket.query_params.get("client_id")
        
    if client_id is None:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, client_id)
    browser = BrowserAutomation()
    try:
        while True:
            data = await websocket.receive_json()
            event = data["event"]
            print(event)
    except WebSocketDisconnect:
        print("Disconnecting...")
        await manager.disconnect(client_id)
        
    