import { WebSocketServer, WebSocket } from 'ws';

export function getWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.broadcast = (data, excludeClient) => {
        wss.clients.forEach((client) => {
            if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    return wss
}