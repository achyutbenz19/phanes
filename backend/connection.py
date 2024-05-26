from typing import Dict
from fastapi.websockets import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(self.active_connections)
        
    async def disconnect(self, client_id: str):
        del self.active_connections[client_id]
        print(self.active_connections)
        
    async def send_personal_message(self, data: dict, websocket: WebSocket):
        await websocket.send_json(data)
        
    async def broadcast(self, data: dict):
        for connection in self.active_connections.values():
            await connection.send_json(data)

manager = ConnectionManager()