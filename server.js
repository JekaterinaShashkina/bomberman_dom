const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

let playerCount = 0;
const maxPlayers = 1;
let countdown = 3;
const gameState = {
  players: {},
  bombs: [],
};
const board = []; // 2D array to represent the game board
// Constants for cell types
const EMPTY = 0;
const WALL = 1;
const PLAYER = 2;
const BOMB = 3;
const EXPLOSION = 4;
const BREAKABLE_WALL = 5;
const POWER_UP_BOMB_COUNT = 6
const POWER_UP_SPEED_COUNT = 7
const POWER_UP_FLAME_COUNT = 8


const initializeBoard = (boardSize) => {
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      // Add walls on the borders and at even cells
      if (
        i === 0 ||
        i === boardSize - 1 ||
        j === 0 ||
        j === boardSize - 1 ||
        (i % 2 === 0 && j % 2 === 0)
      ) {
        row.push(WALL);
      } else if (
        i % 2 === 1 &&
        j % 2 === 1 &&
        !(i === 1 && j === 1) &&
        Math.random() < 0.8
      ) {
        const randomPowerup = getRandomPowerUpType();
        row.push(randomPowerup);
        console.log('randompower up check', randomPowerup);
      } else if (i % 2 === 1 && j % 2 === 1 && !(i === 1 && j === 1) && Math.random() < 0.7) {
        row.push(BREAKABLE_WALL);
      } else {
        row.push(EMPTY);
      }
    }
    board.push(row);
  }

  // Set player position
  playerPosition = { x: 1, y: 1 };
  board[playerPosition.y][playerPosition.x] = PLAYER;

  return board;
};

const getRandomPowerUpType = () => {
    const powerUps = [POWER_UP_BOMB_COUNT, POWER_UP_FLAME_COUNT, POWER_UP_SPEED_COUNT];
    const randomIndex = Math.floor(Math.random()* powerUps.length);
    const selectedPowerUp = powerUps[randomIndex];
    console.log('Selected Power-up:', selectedPowerUp);
    return selectedPowerUp;
}

const map = initializeBoard(15);

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
  // if (req.url === '/game') {
  //   const mapData = generateMap();
  //   ws.send(JSON.stringify({ type: 'map-data', mapData }));
  // }
  ws.on('message', (message) => {
    console.log('Raw received message:', message);
    console.log('String version of message:', message.toString());

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
              gameState: gameState,
            }),
          );

          if (playerCount === maxPlayers) {
            countdownInterval = setInterval(() => {
              countdown--;
              wss.broadcast({ type: 'update-countdown', time: countdown });

              if (countdown <= 0) {
                clearInterval(countdownInterval);
                wss.broadcast({ type: 'game-start', map: map });
              }
            }, 300);
          }
        } else {
          ws.send(
            JSON.stringify({ type: 'join-error', message: 'Game is full!' }),
          );
        }
        break;

      case 'player-move':
        const player = gameState.players[clientData.playerID];
        if (player) {
          player.position = clientData.position;
          wss.broadcast({
            type: 'player-updated',
            playerID: clientData.playerID,
            position: clientData.position,
          });
        }
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
        const serverNickname = gameState.players.nickname;

        // This ensures the sender sees their own message.
        ws.send(
          JSON.stringify({
            type: 'chat-message',
            text: clientData.text,
            sender: serverNickname,
          }),
        );

        // Broadcast to other clients
        wss.broadcast(
          {
            type: 'chat-message',
            text: clientData.text,
            sender: serverNickname,
          },
          ws,
        );
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
