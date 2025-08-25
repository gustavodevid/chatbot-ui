"use client"

import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { ChatArea } from "../components/ChatArea"
import { Header } from "../components/Header"
import { useWebSocket } from "../hooks/use-websocket"

export default function Page() {
  const [selectedWorkspace, setSelectedWorkspace] = useState("Select workspace...")
  const [chats, setChats] = useState<string[]>([])
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080/ws")

  const { isConnected, connectionStatus, messages, connect, disconnect, sendMessage, clearMessages } = useWebSocket({
    url: wsUrl,
    onMessage: (message) => {
      console.log("[v0] New message received:", message)
    },
    onConnect: () => {
      console.log("[v0] Connected to WebSocket server")
    },
    onDisconnect: () => {
      console.log("[v0] Disconnected from WebSocket server")
    },
    onError: (error) => {
      console.error("[v0] WebSocket error:", error)
    },
  })

  const handleNewChat = () => {
    const newChatId = `Chat ${chats.length + 1}`
    setChats([...chats, newChatId])
    clearMessages()
  }

  return (
    <div className="app">
      <Sidebar
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        chats={chats}
        onNewChat={handleNewChat}
      />
      <div className="main-content">
        <Header
          connectionStatus={connectionStatus}
          onConnect={connect}
          onDisconnect={disconnect}
          wsUrl={wsUrl}
          setWsUrl={setWsUrl}
        />
        <ChatArea messages={messages} onSendMessage={sendMessage} isConnected={isConnected} />
      </div>
    </div>
  )
}
