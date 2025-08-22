export interface ChatSession {
  id: string 
  user: {
    name: string 
    avatar: string 
    status: string
  }
  lastMessage: string 
  timestamp: string 
  unread: number
}

export interface AvailableUser {
  id: string
  name: string
  avatar: string
  status: string
}

export type ChatMessages = {
  [key: string]: Message[]
}

export type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
  attachment?: {
    name: string
    url: string
    type: string
    size: string
  }
}
