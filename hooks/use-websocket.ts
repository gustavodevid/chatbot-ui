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
    // ... (nenhuma mudança necessária aqui)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus("connecting")

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        console.log("[v1] WebSocket connected")
        setIsConnected(true)
        setConnectionStatus("connected")
        reconnectAttempts.current = 0
        onConnect?.()
      }


      wsRef.current.onmessage = (event) => {
        // DENTRO DE wsRef.current.onmessage

try {
  const data = JSON.parse(event.data);
  console.log("[v3] Received data:", data); // Versão 3

  switch (data.type) {
    case "start":
      const startMessage: Message = {
        id: data.message_id || Date.now().toString(),
        content: "",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, startMessage]);
      break;

    // ================== AJUSTE FINAL E MAIS IMPORTANTE ==================
    // 1. Mudamos para o case 'token'
    // 2. Usamos 'data.delta' para obter o conteúdo
    case "token":
      // Apenas adiciona conteúdo se 'delta' existir
      if (data.delta) {
        setMessages((prevMessages) => {
          if (prevMessages.length === 0) return [];
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "bot") {
            return prevMessages.map((msg, index) =>
              index === prevMessages.length - 1
                ? { ...msg, content: msg.content + data.delta } // <-- USANDO data.delta
                : msg
            );
          }
          return prevMessages;
        });
      }
      break;

    // ================== AJUSTE FINAL ==================
    // Adicionamos 'done' para funcionar junto com 'end' e 'turn_end'
    case "end":
    case "done":      // <-- NOVO
    case "turn_end":
      console.log("[v3] Stream ended with type:", data.type);
      const finalBotMessage = messages[messages.length - 1];
      if (finalBotMessage) {
        onMessage?.(finalBotMessage);
      }
      break;

    case "full_message":
      const fullMessage: Message = {
        id: data.id || Date.now().toString(),
        content: data.content,
        sender: "bot",
        timestamp: new Date(data.timestamp || Date.now()),
      };
      setMessages((prev) => [...prev, fullMessage]);
      onMessage?.(fullMessage);
      break;

    case "error":
      const errorMessage: Message = {
        id: data.id || Date.now().toString(),
        content: `Erro: ${data.content}`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      onMessage?.(errorMessage);
      break;

    default:
      console.warn("[v3] Received unknown message type:", data);
  }
} catch (error) {
  console.error("[v3] Error parsing message or non-JSON message received:", event.data, error);
}
      }

      wsRef.current.onclose = () => {
        // ... (nenhuma mudança necessária aqui)
        console.log("[v1] WebSocket disconnected")
        setIsConnected(false)
        setConnectionStatus("disconnected")
        onDisconnect?.()

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          console.log(`[v1] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      wsRef.current.onerror = (error) => {
        // ... (nenhuma mudança necessária aqui)
        console.error("[v1] WebSocket error:", error)
        setConnectionStatus("error")
        onError?.(error)
      }
    } catch (error) {
      console.error("[v1] Failed to create WebSocket connection:", error)
      setConnectionStatus("error")
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, messages]) // Adicionado 'messages' à lista de dependências

  const disconnect = useCallback(() => {
    // ... (nenhuma mudança necessária aqui)
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
    // ... (nenhuma mudança necessária aqui, o formato de envio está bom)
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[v1] WebSocket not connected, cannot send message")
      return false
    }

    try {
      const message: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, message])

      wsRef.current.send(
        JSON.stringify({
          type: "message", // O back-end deve esperar por este tipo
          content,
          timestamp: message.timestamp.toISOString(),
        }),
      )

      console.log("[v1] Sent message:", content)
      return true
    } catch (error) {
      console.error("[v1] Error sending message:", error)
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