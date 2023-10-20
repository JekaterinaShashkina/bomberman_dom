const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

let playerCount = 0;
const maxPlayers = 4;
let countdown = 10;
const gameState = {
    players: {},
    bombs: []
};

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let countdownInterval;


wss.broadcast = (data, excludeClient) => {
    wss.clients.forEach((client) => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
       
        console.log("Raw received message:", message);
        console.log("String version of message:", message.toString());
       
           
    
        let clientData;
        try {
            clientData = JSON.parse(message);
            console.log("Parsed client data:", clientData);
        } catch (err) {
            console.error("Failed to parse message from client:", err);
            return;
        }

        switch (clientData.type) {
            //... [your other case handlers]
case 'join-game':
    if (playerCount < maxPlayers) {
        playerCount++;
        const playerID = `player${playerCount}`;
        gameState.players[playerID] = {
            nickname: clientData.nickname,
            position: { x: 0, y: 0 },
            bombs: 1,
            powerups: []
        };

        wss.broadcast({ type: 'update-player-count', count: playerCount });
        ws.send(JSON.stringify({ type: 'joined-successfully', playerID: playerID, gameState: gameState }));

        if (playerCount === maxPlayers) {
            countdownInterval = setInterval(() => {
                countdown--;
                wss.broadcast({ type: 'update-countdown', time: countdown });

                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    wss.broadcast({ type: 'game-start' });
                }
            }, 1000);
        }
    } else {
        ws.send(JSON.stringify({ type: 'join-error', message: 'Game is full!' }));
    }
    break;

case 'player-move':
    const player = gameState.players[clientData.playerID];
    if (player) {
        player.position = clientData.position;
        wss.broadcast({ type: 'player-updated', playerID: clientData.playerID, position: clientData.position });
    }
    break;

case 'place-bomb':
    const bomb = {
        position: clientData.position,
        timer: 3
    };
    gameState.bombs.push(bomb);
    wss.broadcast({ type: 'bomb-placed', bomb: bomb });
    break;

    case 'chat-message':
        const serverNickname = "John";
        
        // This ensures the sender sees their own message.
        ws.send(JSON.stringify({
            type: 'chat-message',
            text: clientData.text,
            sender: serverNickname
        }));
    
        // Broadcast to other clients
        wss.broadcast({
            type: 'chat-message',
            text: clientData.text,
            sender: serverNickname
        }, ws);
        break;
    
        }
    });

    ws.send(JSON.stringify({ type: "welcome", message: "Welcome to the WebSocket server!" }));
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
