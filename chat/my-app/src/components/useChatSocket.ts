// src/hooks/useChatSocket.ts
import { useEffect, useRef } from "react";

export const useChatSocket = (
  conversationId: string | null,
  onMessage: (msg: any) => void
) => {
  console.log("useChatSocket called with conversationId =", conversationId);
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    console.log("useEffect start: conversationId=", conversationId);
    if (!conversationId) {
      console.log("No conversationId: skipping WebSocket connection");
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${protocol}://${window.location.host}/ws/chat/${encodeURIComponent(
      conversationId
    )}/`;
    console.log("Attempting WebSocket to:", socketUrl);
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket open:", socketUrl);
    };
    socket.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
      try {
        onMessageRef.current(JSON.parse(event.data));
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };
    socket.onclose = (e) => {
      console.log("WebSocket closed:", e);
      if (socketRef.current === socket) socketRef.current = null;
    };
    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => {
      try {
        socket.close();
      } catch (err) {
        console.warn("Error closing socket:", err);
      }
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = (payload: any) => {
    console.log("sendMessage called:", payload);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket not open - cannot send");
    }
  };

  return { sendMessage };
};
