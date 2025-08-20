import { NextRequest } from "next/server"
import { WebSocketServer } from "ws"

let wss: WebSocketServer | null = null

export async function GET(req: NextRequest) {
  if (!wss) {
    console.log("Starting Chat WebSocket server...")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const server = (req as any).socket?.server

    if (server) {
      wss = new WebSocketServer({ server, path: "/api/ws/chat" })

      wss.on("connection", (socket) => {
        console.log(" Chat client connected")

        socket.on("message", (msg) => {
          console.log(" Chat:", msg.toString())

          wss?.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(`[Chat] ${msg.toString()}`)
            }
          })
        })

        socket.on("close", () => {
          console.log("Chat client disconnected")
        })
      })
    }
  }

  return new Response("Chat WebSocket server running")
}
