const WEBSOCKET_SERVER_URL = 'ws://localhost:3000';

export default class WebSocketService {
    reconnectDelay = 5000;
    maximumReconnectAttempts = 5;

    constructor() {
        this.socket = null;
        this.messageHandlers = [];
        this.currentReconnectAttempts = 0;
        this.messageQueue = [];
    }

    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    connect(url = WEBSOCKET_SERVER_URL) {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = event => {
            console.log('WebSocket connection opened:', event);
            this.currentReconnectAttempts = 0;
            while (this.messageQueue.length) {
                this.send(this.messageQueue.shift());
            }
        };

        this.socket.onerror = error => {
            console.error('WebSocket encountered an error:', error);
        };

        this.socket.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                this.messageHandlers.forEach(handler => handler(data));
            } catch (error) {
                console.warn('Received a non-JSON message:', event.data);
                console.error(error)
            }
        };

        this.socket.onclose = event => {
            console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
            if (this.currentReconnectAttempts < this.maximumReconnectAttempts) {
                console.log('Reconnecting in', this.reconnectDelay, 'ms...');
                setTimeout(() => this.connect(url), this.reconnectDelay);
                this.currentReconnectAttempts++;
            } else {
                console.error('Maximum reconnect attempts reached. Please check your connection.');
            }
        };
    }

    addMessageHandler(handler) {
        if (typeof handler === 'function') {
            this.messageHandlers.push(handler);
        } else {
            console.error('Handler must be a function');
        }
    }

    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }


    send(data) {
        try {
            if (this.isConnected()) {
                this.socket.send(JSON.stringify(data));
            } else {
                console.warn('WebSocket is not open. Queuing the message for later:', data);
                this.messageQueue.push(data);
            }
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
