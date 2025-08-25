"use client"

import { ChevronDown, Settings, Wifi, WifiOff, Loader2 } from "lucide-react"

interface HeaderProps {
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  onConnect: () => void
  onDisconnect: () => void
  wsUrl: string
  setWsUrl: (url: string) => void
}

export function Header({ connectionStatus, onConnect, onDisconnect, wsUrl, setWsUrl }: HeaderProps) {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Loader2 size={16} className="animate-spin" />
      case "connected":
        return <Wifi size={16} className="text-green-500" />
      case "error":
        return <WifiOff size={16} className="text-red-500" />
      default:
        return <WifiOff size={16} className="text-gray-500" />
    }
  }

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting..."
      case "connected":
        return "Connected"
      case "error":
        return "Connection Error"
      default:
        return "Disconnected"
    }
  }

  return (
    <div className="header">
      <div className="header-left">
        <button className="quick-settings-button">
          Quick Settings
          <ChevronDown size={16} />
        </button>

        <div className="connection-controls">
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="WebSocket URL"
            className="ws-url-input"
          />
          <button
            onClick={connectionStatus === "connected" ? onDisconnect : onConnect}
            className={`connection-button ${connectionStatus}`}
          >
            {getConnectionIcon()}
            {getConnectionText()}
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="model-selector">
          GPT-4 Turbo
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
