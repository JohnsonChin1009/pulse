import { NextRequest } from "next/server"
import { WebSocketServer } from "ws"

let wss: WebSocketServer | null = null

export async function GET(req: NextRequest) {
  if (!wss) {
    console.log("🚀 Starting Online Tracker WebSocket server...")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const server = (req as any).socket?.server
    if (server) {
      wss = new WebSocketServer({ server, path: "/api/ws/online" })

      wss.on("connection", (socket) => {
        console.log("Online client connected")

        socket.send("You are online")

        socket.on("message", (msg) => {
          console.log("Online:", msg.toString())

          wss?.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(`[Online] ${msg.toString()}`)
            }
          })
        })

        socket.on("close", () => {
          console.log("Online client disconnected")
        })
      })
    }
  }

  return new Response("Online WebSocket server running")
}
