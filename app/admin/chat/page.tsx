/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Send, Menu, X, Plus, Paperclip, Download, FileText, ImageIcon } from "lucide-react"
import { ChatSession, AvailableUser, Message, ChatMessages } from "./ChatTypes";


const conversations: ChatSession[] = [
  {
    id: "1",
    user: {
      name: "Test 1",
      avatar: "/images/soh.png",
      status: "online",
    },
    lastMessage: "Test test",
    timestamp: "2 min ago",
    unread: 2,
  },
]

const availableUsers: AvailableUser[] = [
  {
    id: "3",
    name: "John Doe",
    avatar: "/images/soh.png",
    status: "online",
  },
  {
    id: "4",
    name: "Jane Smith",
    avatar: "/images/soh.png",
    status: "offline",
  },
  {
    id: "5",
    name: "Mike Johnson",
    avatar: "/images/soh.png",
    status: "online",
  },
  {
    id: "6",
    name: "Sarah Wilson",
    avatar: "/images/soh.png",
    status: "online",
  },
]


const initialMessages: ChatMessages = {
  "1": [
    {
      id: "1",
      sender: "user",
      content: "Why this page not work",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "admin",
      content: "Ni mama",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "user",
      content: "Here's the screenshot of the issue",
      timestamp: "10:35 AM",
      attachment: {
        name: "screenshot.png",
        url: "/screenshot-of-code.png",
        type: "image",
        size: "245 KB",
      },
    },
  ],
}

export default function LiveChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [allConversations, setAllConversations] = useState(conversations)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, selectedConversation])
  
  const handleSendMessage = () => {
    if ((newMessage.trim() || selectedAttachment) && selectedConversation) {
      const newMsg: Message = {
        id: "test",
        sender: "admin",
        content: newMessage || (selectedAttachment ? `Sent ${selectedAttachment.name}` : ""),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      if (selectedAttachment) {
        const fileType = selectedAttachment.type.startsWith("image/") ? "image" : "file"
        newMsg.attachment = {
          name: selectedAttachment.name,
          url: URL.createObjectURL(selectedAttachment),
          type: fileType,
          size: `${Math.round(selectedAttachment.size / 1024)} KB`,
        }
      }

      const updated = [...(chatMessages[selectedConversation.id] || []), newMsg]
      setChatMessages({ ...chatMessages, [selectedConversation.id]: updated })
      setNewMessage("")
      setSelectedAttachment(null)
    }
  }

  const handleAddUser = (user: AvailableUser) => {
    const newConversation: ChatSession = {
      id: user.id.toString(),
      user: {
        name: user.name,
        avatar: user.avatar,
        status: user.status,
      },
      lastMessage: "Start a conversation...",
      timestamp: "now",
      unread: 0,
    }

    // Check if conversation already exists
    const existingConversation = allConversations.find((conv) => conv.id === user.id.toString())
    if (!existingConversation) {
      setAllConversations([newConversation, ...allConversations])
      setChatMessages({ ...chatMessages, [user.id]: [] })
    }

    setSelectedConversation(newConversation)
    setDialogOpen(false)
    setUserSearchTerm("")
    setSidebarOpen(false)
  }

  const filteredConversations = allConversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAvailableUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
      !allConversations.some((conv) => conv.id === user.id.toString()),
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedAttachment(file)
    }
  }

  const removeAttachment = () => {
    setSelectedAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownload = (attachment: { name: string; url: string }) => {
    const link = document.createElement("a")
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderAttachment = (attachment: { name: string; url: string; type: string; size: string }) => {
    if (attachment.type === "image") {
      return (
        <div className="mt-2 relative group">
          <img
            src={attachment.url || ""}
            alt={attachment.name}
            className="max-w-xs rounded-lg border border-gray-200"
          />
          <Button
            onClick={() => handleDownload(attachment)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8"
            size="sm"
          >
            <Download className="w-4 h-4" />
          </Button>
          <div className="mt-1 text-xs opacity-70">
            {attachment.name} • {attachment.size}
          </div>
        </div>
      )
    } else {
      return (
        <div className="mt-2 flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20">
          <FileText className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.name}</p>
            <p className="text-xs opacity-70">{attachment.size}</p>
          </div>
          <Button
            onClick={() => handleDownload(attachment)}
            className="bg-white/20 hover:bg-white/30 text-current p-1 h-8 w-8"
            size="sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-25 md:pb-0 mb-0 md:mb-12">
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
                        className={`w-2 h-2 rounded-full ${getStatusColor(selectedConversation.user.status)}`}
                      ></span>
                      {selectedConversation.user.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {(chatMessages[selectedConversation.id] || []).map((message, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.sender === "admin" ? "bg-[#F5BE66] text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.attachment && renderAttachment(message.attachment)}
                      <p className={`text-xs mt-1 ${message.sender === "admin" ? "text-white/70" : "text-gray-500"}`}>
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
              {selectedAttachment && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    {selectedAttachment.type.startsWith("image/") ? (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedAttachment.name}</p>
                      <p className="text-xs text-gray-500">{Math.round(selectedAttachment.size / 1024)} KB</p>
                    </div>
                    <Button
                      onClick={removeAttachment}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-500 p-1 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  className="text-gray-500 hover:text-[#F5BE66] rounded-xl hover:bg-[#F5BE66]/10 w-12 h-12 flex items-center justify-center"
                >
                  <Paperclip className="w-20 h-20" />
                </Button>

                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border-gray-300 focus:border-[#F5BE66] focus:ring-[#F5BE66]"
                />
                <Button
                  type="submit"
                  className="bg-[#F5BE66] hover:bg-[#E5AE56] w-15 h-12 text-white flex items-center justify-center"
                  disabled={!newMessage.trim() && !selectedAttachment}
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
              fixed top-0 left-0 h-full w-80 z-50 md:z-20
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

            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Conversations</h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#F5BE66]/10 hover:text-[#F5BE66]">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-[#F5BE66] focus:ring-[#F5BE66]"
                      />
                    </div>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredAvailableUsers.map((user) => (
                          <div
                            key={user.id}
                            className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleAddUser(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-[#F5BE66] text-white text-sm">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                                    user.status,
                                  )}`}
                                ></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                                  <span className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></span>
                                  {user.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredAvailableUsers.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No users found</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
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
                            conversation.user.status,
                          )}`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate text-sm">{conversation.user.name}</p>
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
