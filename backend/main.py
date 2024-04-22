from fastapi import FastAPI
from fastapi.websockets import WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from browser import BrowserAutomation
from typing import Optional
from manager import manager
from gemini import *

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

async def navigate_ui(browser, websocket):
    nav_check_flag = False
    interpret_flag = False
    generate_flag = False
    max_tries = 3
    
    browser = BrowserAutomation()

    while (
        not nav_check_flag or not interpret_flag or not generate_flag and max_tries > 0
    ):
        max_tries -= 1
        try:
            if not nav_check_flag:
                url = browser.get_url()
                print(f"URL: {url}")
                nav = navigate_check(active_prompt, url)
                print(nav)

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
                    browser.navigate(browser, nav["url"])
                    print(f"Navigating to {nav['url']}")
                    await asyncio.sleep(1.5)
                nav_check_flag = True

            if not interpret_flag:
                url = getUrl(browser)
                html = scrape(browser)
                take_screenshot(browser)
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
                print(selectors)
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
    browser = BrowserAutomation()
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            event = data["event"]
            if event == "start":
                browser.open_browser(url)
            elif event == "prompt":
                active_prompt = data["prompt"]
                await navigate_ui(browser, websocket)
            
            await manager.send_personal_message({"event": "done"}, websocket)
    except WebSocketDisconnect:
        print("Disconnecting...")
        await manager.disconnect(client_id)
        
    