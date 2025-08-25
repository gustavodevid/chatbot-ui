"use client"

import { useState } from "react"
import { ChevronDown, Plus, Search, MessageSquare, Edit3, Copy, Calendar, Settings } from "lucide-react"

interface SidebarProps {
  selectedWorkspace: string
  setSelectedWorkspace: (workspace: string) => void
  chats: string[]
  onNewChat: () => void
}

export function Sidebar({ selectedWorkspace, setSelectedWorkspace, chats, onNewChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="workspace-selector">
          <button className="workspace-button">
            <MessageSquare size={20} />
            <span>{selectedWorkspace}</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="new-chat-section">
          <button className="new-chat-button" onClick={onNewChat}>
            <Plus size={16} />
            New Chat
          </button>
          <button className="copy-button">
            <Copy size={16} />
          </button>
        </div>

        <div className="search-section">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {chats.length === 0 ? (
          <div className="no-chats">
            <em>No chats.</em>
          </div>
        ) : (
          <div className="chats-list">
            {chats.map((chat, index) => (
              <div key={index} className="chat-item">
                {chat}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-icons">
          <button className="sidebar-icon">
            <MessageSquare size={20} />
          </button>
          <button className="sidebar-icon">
            <Edit3 size={20} />
          </button>
          <button className="sidebar-icon">
            <Copy size={20} />
          </button>
          <button className="sidebar-icon">
            <Calendar size={20} />
          </button>
          <button className="sidebar-icon">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
