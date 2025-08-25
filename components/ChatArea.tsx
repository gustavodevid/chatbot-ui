"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Plus, HelpCircle } from "lucide-react"
import type { Message } from "../hooks/use-websocket"

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (message: string) => boolean
  isConnected: boolean
}

export function ChatArea({ messages, onSendMessage, isConnected }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      const success = onSendMessage(message.trim())
      if (success) {
        setMessage("")
      }
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
        {messages.length > 0 ? (
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <span className="message-text">{msg.content}</span>
                  <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="welcome-section">
            <div className="ui-icon">
              <span>UI</span>
            </div>
            <h1 className="welcome-title">Chatbot UI</h1>
            <p className="connection-status">
              {isConnected ? "Connected - Ready to chat!" : "Connect to WebSocket to start chatting"}
            </p>
          </div>
        )}
      </div>

      <div className="chat-input-section">
        <div className="chat-input-container">
          <button className="add-button">
            <Plus size={20} />
          </button>
          <input
            type="text"
            placeholder={isConnected ? "Send a message..." : "Connect to WebSocket first..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
            disabled={!isConnected}
          />
          <button className="send-button" onClick={handleSendMessage} disabled={!message.trim() || !isConnected}>
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
