import { WebSocketServer } from "ws";
import { messageHandler } from "./handler/messageHandler.js";
import { handleDisconnect } from "./services/disconnection.js";

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
    console.log("----- client connected")

    ws.on('message', (msg) => messageHandler(ws, msg))

    ws.on('error', (info) => {
        console.log("Websocket error!", info.toString())
    })

    ws.on('close', (msg) => {
        console.log("----- client disconnected", msg.toString())
        handleDisconnect(ws)
    })
})
