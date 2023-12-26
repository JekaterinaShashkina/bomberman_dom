// ... (rest of the code)

// Primary WebSocket server for the frontend
const wssFrontend = new WebSocketServer({ server });
const serverGameCoreFrontend = new ServerGameCore(wssFrontend);

// Game WebSocket server for game logic-related messages
const gameServer = http.createServer();
const wssGame = new WebSocketServer({ server: gameServer });
const serverGameCoreGame = new ServerGameCore(wssGame);

// ... (rest of the code)

wssFrontend.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle messages related to the frontend
    // ...
  });

  // ...
});

wssGame.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle messages related to game logic
    let clientData;
    try {
      clientData = JSON.parse(message);
      console.log('Parsed client data for game logic:', clientData);
    } catch (err) {
      console.error('Failed to parse message for game logic:', err);
      return;
    }

    // Process game-related messages using serverGameCoreGame
    if (serverGameCoreGame) {
      serverGameCoreGame.handleMessage(clientData);
    }
  });

  // ...
});

// ... (rest of the code)

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

gameServer.listen(gameServerPort, () => {
  console.log(`Game server is running at http://localhost:${gameServerPort}`);
});