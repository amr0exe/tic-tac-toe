import { WebSocketServer } from "ws";
import { messageHandler } from "./handler/message-handler.js";
import { handleDisconnect } from "./services/disconnectionServices.js";

export const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
    console.log("---- client connnected")

    ws.on('message', (msg) => messageHandler(ws, msg))

    ws.on('error', (info) => { console.log("WebSocket Error", info)})

    ws.on('close', (msg) => {
        console.log("---- client disconnnected", msg.toString())
        handleDisconnect(ws)
    })
})
