"use client"

import type React from "react"

import { useState } from "react"
import { Send, Plus, HelpCircle } from "lucide-react"

export function ChatArea() {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-area">
      <div className="chat-content">
        <div className="welcome-section">
          <div className="ui-icon">
            <span>UI</span>
          </div>
          <h1 className="welcome-title">Chatbot UI</h1>
        </div>
      </div>

      <div className="chat-input-section">
        <div className="chat-input-container">
          <button className="add-button">
            <Plus size={20} />
          </button>
          <input
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
          />
          <button className="send-button" onClick={handleSendMessage} disabled={!message.trim()}>
            <Send size={20} />
          </button>
        </div>

        <button className="help-button">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  )
}
