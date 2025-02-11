import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { PLAYER_POSITIONS } from '../frontend/const.js';
import ServerGameCore from './js/core/ServerGameCore.js';
import Player from './js/core/Player.js';
import { getWebSocketServer } from './js/utils/websocketServer.js'

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const pathToFrontend = '../frontend'
const frontendDirPath = path.join(__dirname, pathToFrontend)

const MAX_PLAYERS = 4
const MIN_PLAYERS = 2
let countdown = 30;
let playerCount = 0;

app.use(express.static(path.join(frontendDirPath, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDirPath, 'index.html'));
});

const server = http.createServer(app);
const wss = getWebSocketServer(server)
const serverGameCore = new ServerGameCore(wss)

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
        if (playerCount < MAX_PLAYERS) {
          playerCount++;
          wss.broadcast({ type: 'update-player-count', count: playerCount });
          const player = new Player(playerCount, PLAYER_POSITIONS[playerCount], clientData.nickname, wss)

          ws.send(
            JSON.stringify({
              type: 'joined-successfully',
              player: player
            }),
          );

          serverGameCore.addPlayer(playerCount, player)

          if (playerCount === MAX_PLAYERS) {
            countdown = 10
          }

          if (playerCount === MIN_PLAYERS) {
            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown <= 10) {
                wss.broadcast({ type: 'update-countdown', time: countdown });
              }

              if (countdown <= 0) {
                clearInterval(countdownInterval);
                serverGameCore.startGame()
              }
            }, 1000);
          }
        } else {
          ws.send(
            JSON.stringify({ type: 'join-error', message: 'Game is full!' }),
          );
        }
        break;
      case 'chat-message':
        wss.broadcast(clientData);
        break;
      default:
        if (serverGameCore) {
          serverGameCore.handleMessage(clientData)
        }
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
