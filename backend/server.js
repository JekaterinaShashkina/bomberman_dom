import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { initializeBoard } from './js/map/map.js';
import { PLAYER_POSITIONS } from './js/core/const.js';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const pathToFrontend = '../frontend'
const frontendDirname = path.join(__dirname, pathToFrontend)

export let playerCount = 0;
const maxPlayers = 1;
let countdown = 3;
const gameState = {
  players: {},
  bombs: [],
};

app.use(express.static(path.join(frontendDirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDirname, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

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

    let clientData;
    try {
      clientData = JSON.parse(message);
      console.log('Parsed client data:', clientData);
    } catch (err) {
      console.error('Failed to parse message from client:', err);
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
            bombCount: 1,
            powerups: [],
          };
          console.log(gameState);

          wss.broadcast({ type: 'update-player-count', count: playerCount });
          ws.send(
            JSON.stringify({
              type: 'joined-successfully',
              playerID: playerID,
              startPosition: PLAYER_POSITIONS[playerCount]
            }),
          );

          if (playerCount === maxPlayers) {
            countdownInterval = setInterval(() => {
              countdown--;
              wss.broadcast({ type: 'update-countdown', time: countdown });

              if (countdown <= 0) {
                clearInterval(countdownInterval);
                const map = initializeBoard(playerCount);
                wss.broadcast({ type: 'game-start', map: map });
              }
            }, 1000);
          }
        } else {
          ws.send(
            JSON.stringify({ type: 'join-error', message: 'Game is full!' }),
          );
        }
        break;

      case 'player-move':
        wss.broadcast({
          type: 'player-move',
          playerID: clientData.playerID,
          coordinates: clientData.coordinates,
        });
        // }
        break;

      case 'place-bomb':
        const bomb = {
          position: clientData.position,
          timer: 3,
        };
        gameState.bombs.push(bomb);
        wss.broadcast({ type: 'bomb-placed', bomb: bomb });
        break;

      case 'chat-message':
        wss.broadcast(clientData);
        break;
    }
  });

  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Welcome to the WebSocket server!',
    }),
  );
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
