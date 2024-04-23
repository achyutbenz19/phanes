"use client"
import { useEffect, useState } from "react"
import ReconnectingWebSocket from "reconnecting-websocket";

const Init = () => {
    const [connection, setConnection] = useState<ReconnectingWebSocket | null>(null)
    const index = false

    useEffect(() => {
        const rws = new ReconnectingWebSocket('ws://localhost:8000/ws?client_id=client-id');
        setConnection(rws)
    }, [index])

    return (
        <div className="absolute top-0 right-0 m-3">
            {connection ? "connected" : "not connected"}
        </div>
    )
}

export default Init