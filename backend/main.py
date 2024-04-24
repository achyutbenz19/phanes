from fastapi import FastAPI
from fastapi.websockets import WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from browser import BrowserAutomation
from typing import Optional
from manager import manager
from gemini import *
import PIL.Image
import asyncio

app = FastAPI()
browser = BrowserAutomation()

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

async def navigate_ui(browser, websocket):
    nav_check_flag = False
    interpret_flag = False
    generate_flag = False
    max_tries = 3

    while (not nav_check_flag or not interpret_flag or not generate_flag):
        max_tries -= 1
        try:
            if not nav_check_flag:
                url = browser.get_url()
                print(f"URL: {url}")
                nav = navigate_check(active_prompt, url)

                if nav["type"] == "navigate":
                    await manager.send_personal_message(
                        {
                            "event": "thought",
                            "data": {
                                "thought": f"I'm navigating to {nav['url']}",
                            },
                        },
                        websocket,
                    )
                    browser.navigate(nav["url"])
                    print(f"Navigating to {nav['url']}")
                    await asyncio.sleep(1.5)
                nav_check_flag = True

            if not interpret_flag:
                url = browser.get_url()
                html = browser.scrape()
                browser.take_screenshot("website.png")
                img = PIL.Image.open("website.png")

                print("Gemini is interpreting...")
           
                await manager.send_personal_message(
                    {
                        "event": "thought",
                        "data": {
                            "thought": "I'm interpreting the page...",
                        },
                    },
                    websocket,
                )
                selectors = interpret(active_prompt, url, html, img)
                interpret_flag = True

            if not generate_flag:
                print("Gemini is generating...")
                await manager.send_personal_message(
                    {
                        "event": "thought",
                        "data": {
                            "thought": "I'm generating the UI...",
                        },
                    },
                    websocket,
                )
                generated_ui = generate(html, selectors["selectors"], url)
                print("Gemini is done...")
                await manager.send_personal_message(
                    {
                        "event": "ui",
                        "data": {
                            "html": generated_ui,
                        },
                    },
                    websocket,
                )
                generate_flag = True
                
            if max_tries < 0:
                break
            
        except Exception as e:
            print(e)

@app.get("/")
async def root():
    return {"message": "Hello World"}

active_prompt = ""
url = None

@app.websocket("/ws")
async def websocket_ep(websocket: WebSocket, client_id: Optional[str] = None):
    global active_prompt
    global url
    
    if client_id is None:
        client_id = websocket.query_params.get("client_id")
        
    if client_id is None:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, client_id)
    browser.open_browser()
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            event = data["event"]
            
            if event == "prompt":
                active_prompt = data["prompt"]
                await navigate_ui(browser, websocket)
            
            await manager.send_personal_message({"event": "done"}, websocket)
    except WebSocketDisconnect:
        print("Disconnecting...")
        await manager.disconnect(client_id)
