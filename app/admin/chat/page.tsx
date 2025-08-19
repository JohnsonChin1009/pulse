"use client"

import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Menu, X } from "lucide-react"

const conversations = [
  {
    id: 1,
    user: {
      name: "Test 1",
      avatar: "/images/soh.png",
      status: "online",
    },
    lastMessage: "Test test",
    timestamp: "2 min ago",
    unread: 2,
  },
  {
    id: 2,
    user: {
      name: "Test 2",
      avatar: "/images/soh.png",
      status: "online",
    },
    lastMessage: "Wo cao",
    timestamp: "15 min ago",
    unread: 1,
  },
]

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

type ChatMessages = {
  [key: number]: Message[]
}

const initialMessages: ChatMessages = {
  1: [
    {
      id: 1,
      sender: "user",
      content: "Why this page not work",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "admin",
      content: "Ni mama",
      timestamp: "10:32 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "user",
      content: "Why this page not work",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "admin",
      content: "Ni mama",
      timestamp: "10:32 AM",
    },
  ],
}

export default function LiveChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [sidebarOpen, setSidebarOpen] = useState(false) 
  const messagesEndRef = useRef<HTMLDivElement>(null)

// scroll to bottom when messages change dont delete this
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chatMessages, selectedConversation])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const updated = [
        ...(chatMessages[selectedConversation.id] || []),
        {
          id: Date.now(),
          sender: "admin",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]
      setChatMessages({ ...chatMessages, [selectedConversation.id]: updated })
      setNewMessage("")
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto md:mb-0 mb-25">
      <div className="mb-6">
        <h1 className="font-montserrat font-bold text-3xl text-gray-900 mb-2">Live Chat</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex h-[850px] relative">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#F5BE66] text-white">
                      {selectedConversation.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.user.name}</h3>
                    <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          selectedConversation.user.status
                        )}`}
                      ></span>
                      {selectedConversation.user.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">

                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(chatMessages[selectedConversation.id] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.sender === "admin" ? "bg-[#F5BE66] text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "admin" ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-3"
              >
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border-gray-300 focus:border-[#F5BE66] focus:ring-[#F5BE66]"
                />
                <Button
                  type="submit"
                  className="bg-[#F5BE66] hover:bg-[#E5AE56] w-15 h-12 text-white flex items-center justify-center"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Conversations Sidebar */}
          <div
            className={`
              md:w-96 border-l border-gray-200 flex flex-col bg-white 
              md:static md:translate-x-0 transition-transform duration-300
              fixed top-0 left-0 h-full w-80 z-50
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {/* Search hidden in mobile */}
            <div className="p-4 border-b border-gray-200 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-[#F5BE66] focus:ring-[#F5BE66]"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedConversation.id === conversation.id
                        ? "bg-[#F5BE66]/10 border-r-4 border-r-[#F5BE66]"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      setSidebarOpen(false) 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.user.avatar || "/images/johnson.png"} />
                          <AvatarFallback className="bg-[#F5BE66] text-white text-sm">
                            {conversation.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                            conversation.user.status
                          )}`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {conversation.user.name}
                          </p>
                          <div className="flex items-center gap-1">
                            {conversation.unread > 0 && (
                              <div className="bg-[#F5BE66] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unread}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
