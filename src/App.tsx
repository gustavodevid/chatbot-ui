"use client"

import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { ChatArea } from "./components/ChatArea"
import { Header } from "./components/Header"
import "./App.css"

function App() {
  const [selectedWorkspace, setSelectedWorkspace] = useState("Select workspace...")
  const [chats, setChats] = useState<string[]>([])

  const handleNewChat = () => {
    const newChatId = `Chat ${chats.length + 1}`
    setChats([...chats, newChatId])
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
        <Header />
        <ChatArea />
      </div>
    </div>
  )
}

export default App
