/**
 * WebSocket client for real-time notifications
 * Handles connection, reconnection, and message routing
 */

export type MessageType = 'incident_status_changed' | 'comment_added' | 'department_assigned' | 'ping' | 'pong'

export interface WebSocketMessage {
  type: MessageType
  data?: any
  incidentId?: string
  newStatus?: string
  comment?: string
  department?: string
  timestamp?: string
}

export interface WebSocketCallbacks {
  onStatusChanged?: (incidentId: string, newStatus: string, data: any) => void
  onCommentAdded?: (incidentId: string, comment: string, data: any) => void
  onDepartmentAssigned?: (incidentId: string, department: string, data: any) => void
  onError?: (error: Event) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export class IncidentWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private userId: string
  private token: string
  private callbacks: WebSocketCallbacks
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: NodeJS.Timeout | null = null
  private isIntentionallyClosed = false

  constructor(url: string, userId: string, token: string, callbacks: WebSocketCallbacks = {}) {
    this.url = url
    this.userId = userId
    this.token = token
    this.callbacks = callbacks
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected')
      return
    }

    this.isIntentionallyClosed = false

    try {
      // Build WebSocket URL with authentication parameters
      const wsUrl = `${this.url}?userId=${encodeURIComponent(this.userId)}&token=${encodeURIComponent(this.token)}`
      
      console.log('🔌 Connecting to WebSocket:', wsUrl.replace(this.token, '***'))
      
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        this.reconnectAttempts = 0
        this.callbacks.onConnect?.()
        this.startPingInterval()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('📨 WebSocket message received:', message)
          this.handleMessage(message)
        } catch (err) {
          console.error('❌ Failed to parse WebSocket message:', err)
        }
      }

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        this.callbacks.onError?.(error)
      }

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason)
        this.stopPingInterval()
        this.callbacks.onDisconnect?.()

        // Attempt reconnection if not intentionally closed
        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          setTimeout(() => this.connect(), delay)
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached. WebSocket disabled.')
        }
      }
    } catch (err) {
      console.error('❌ Failed to create WebSocket:', err)
      this.callbacks.onError?.(err as Event)
    }
  }

  disconnect() {
    console.log('🔌 Disconnecting WebSocket')
    this.isIntentionallyClosed = true
    this.stopPingInterval()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending WebSocket message:', message)
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message')
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'incident_status_changed':
        if (message.incidentId && message.newStatus) {
          this.callbacks.onStatusChanged?.(message.incidentId, message.newStatus, message.data)
        }
        break

      case 'comment_added':
        if (message.incidentId && message.comment) {
          this.callbacks.onCommentAdded?.(message.incidentId, message.comment, message.data)
        }
        break

      case 'department_assigned':
        if (message.incidentId && message.department) {
          this.callbacks.onDepartmentAssigned?.(message.incidentId, message.department, message.data)
        }
        break

      case 'pong':
        console.log('🏓 Pong received')
        break

      default:
        console.log('📨 Unknown message type:', message.type)
    }
  }

  private startPingInterval() {
    // Send ping every 4 minutes to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        console.log('🏓 Sending ping')
        this.send({ type: 'ping' })
      }
    }, 4 * 60 * 1000)
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getReadyState(): number | null {
    return this.ws?.readyState ?? null
  }
}
