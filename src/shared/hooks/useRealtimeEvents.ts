'use client';

import { useEffect, useRef } from 'react';

export interface RealtimeEventPayload {
  topic: string;
  action: string;
  entityId?: string | null;
  isYouth?: boolean | null;
  timestamp?: string;
}

type RealtimeListener = (event: RealtimeEventPayload) => void;

const listeners = new Set<RealtimeListener>();
let sharedSocket: WebSocket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;

function resolveWebSocketUrl(): string {
  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998').trim().replace(/\/+$/, '');
  if (rawApiUrl.startsWith('https://')) {
    return `${rawApiUrl.replace(/^https:\/\//, 'wss://')}/ws/events`;
  }
  if (rawApiUrl.startsWith('http://')) {
    return `${rawApiUrl.replace(/^http:\/\//, 'ws://')}/ws/events`;
  }
  return `ws://localhost:7998/ws/events`;
}

function clearTimers() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (typeof window === 'undefined' || listeners.size === 0 || reconnectTimer) {
    return;
  }
  const delay = Math.min(15000, 1500 * Math.pow(2, reconnectAttempt));
  reconnectAttempt = Math.min(reconnectAttempt + 1, 4);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    ensureSocketConnected();
  }, delay);
}

function ensureSocketConnected() {
  if (typeof window === 'undefined' || listeners.size === 0) {
    return;
  }
  if (
    sharedSocket &&
    (sharedSocket.readyState === WebSocket.OPEN || sharedSocket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  try {
    const ws = new WebSocket(resolveWebSocketUrl());
    sharedSocket = ws;

    ws.onopen = () => {
      reconnectAttempt = 0;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('PING');
        }
      }, 25000);
    };

    ws.onmessage = (msg) => {
      const data = typeof msg.data === 'string' ? msg.data.trim() : '';
      if (!data || data === 'PONG') return;
      try {
        const parsed = JSON.parse(data) as RealtimeEventPayload;
        if (parsed && parsed.topic) {
          listeners.forEach((cb) => {
            try {
              cb(parsed);
            } catch (err) {
              console.error('[Realtime] Listener error:', err);
            }
          });
        }
      } catch {
        // Ignore non-JSON frames
      }
    };

    ws.onclose = () => {
      if (sharedSocket === ws) {
        sharedSocket = null;
      }
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      scheduleReconnect();
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        // Ignore close error
      }
    };
  } catch {
    scheduleReconnect();
  }
}

function teardownIfIdle() {
  if (listeners.size > 0) return;
  clearTimers();
  if (sharedSocket) {
    try {
      sharedSocket.close();
    } catch {
      // Ignore
    }
    sharedSocket = null;
  }
}

export function useRealtimeEvents(
  topic: string | readonly string[] | string[],
  onEvent: (event: RealtimeEventPayload) => void,
) {
  const callbackRef = useRef(onEvent);
  callbackRef.current = onEvent;

  const topicsKey = Array.isArray(topic) ? topic.join(',') : topic;

  useEffect(() => {
    const listener: RealtimeListener = (event) => {
      const matches = Array.isArray(topic)
        ? topic.includes(event.topic)
        : event.topic === topic;
      if (matches) {
        callbackRef.current(event);
      }
    };

    listeners.add(listener);
    ensureSocketConnected();

    return () => {
      listeners.delete(listener);
      teardownIfIdle();
    };
  }, [topicsKey]);
}

