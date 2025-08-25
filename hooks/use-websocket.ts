"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface UseWebSocketProps {
  url: string
  onMessage?: (message: Message) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export function useWebSocket({ url, onMessage, onConnect, onDisconnect, onError }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus("connecting")

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        console.log("[v0] WebSocket connected")
        setIsConnected(true)
        setConnectionStatus("connected")
        reconnectAttempts.current = 0
        onConnect?.()
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const message: Message = {
            id: data.id || Date.now().toString(),
            content: data.content || data.message || event.data,
            sender: data.sender || "bot",
            timestamp: new Date(data.timestamp || Date.now()),
          }

          console.log("[v0] Received message:", message)
          setMessages((prev) => [...prev, message])
          onMessage?.(message)
        } catch (error) {
          console.error("[v0] Error parsing message:", error)
          // Handle plain text messages
          const message: Message = {
            id: Date.now().toString(),
            content: event.data,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, message])
          onMessage?.(message)
        }
      }

      wsRef.current.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)
        setConnectionStatus("disconnected")
        onDisconnect?.()

        // Auto-reconnect logic
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          console.log(`[v0] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setConnectionStatus("error")
        onError?.(error)
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket connection:", error)
      setConnectionStatus("error")
    }
  }, [url, onMessage, onConnect, onDisconnect, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setConnectionStatus("disconnected")
  }, [])

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[v0] WebSocket not connected, cannot send message")
      return false
    }

    try {
      const message: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      }

      // Add user message to local state immediately
      setMessages((prev) => [...prev, message])

      // Send to server
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          content,
          timestamp: message.timestamp.toISOString(),
        }),
      )

      console.log("[v0] Sent message:", content)
      return true
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      return false
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    connectionStatus,
    messages,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  }
}
