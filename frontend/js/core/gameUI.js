import { renderBoard } from './map.js';
import WebSocketService from '../utils/websocket.js';
import { handlePlayerMovement, setBoard } from './game.js';

export default class GameUI {
  constructor(startBoard) {
    this.webSocketService = new WebSocketService()
    this.webSocketService.connect();

    // DOM Elements
    this.mapSection = document.getElementById('map');
    this.gameContainer = document.getElementById('game-container');
    this.chatInput = document.getElementById('chat-input');
    this.sendButton = document.getElementById('send-button');
    this.messagesDiv = document.getElementById('messages');

    // Initialize game elements
    this.initGame(startBoard)

    // Event listeners
    this.sendButton.addEventListener('click', this.sendChatMessage);
    this.webSocketService.addMessageHandler(this.handleWebSocketMessage);

    // Handle keydown
    window.addEventListener('keydown', (event) => {
      const { key } = event;
      handlePlayerMovement(key);
    });

  }

  handleWebSocketMessage(data) {
    console.log('Received WS message:', data);
    switch (data.type) {
      case 'update-lives':
        livesCount.innerText = data.lives;
        break;
      case 'update-bomb':
        bombCount.innerText = data.bombs;
        break;
      case 'update-flame':
        flameCount.innerText = data.flames;
        break;
      case 'update-speed':
        speedLevel.innerText = data.speed;
        break;
      case 'chat-message':
        this.displayChatMessage(data.sender, data.text);
        break;
      case 'player-move':
        movePlayer(data.playerId, data.newPosition);
        break;
      case 'place-bomb':
        placeBombOnMap(data.position);
        break;
      // ... Additional game-related updates
    }
  }

  initGame(startBoard) {
    setBoard(startBoard)
    renderBoard();
  }

  sendChatMessage() {
    const chatMessage = chatInput.value.trim();
    if (!chatMessage) return;

    this.webSocketService.send({
      type: 'chat-message',
      text: chatMessage,
    });

    chatInput.value = ''; // Clear chat input after sending
  }

  displayChatMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // function movePlayer(playerId, newPosition) {
  //   const playerElement = document.getElementById(playerId);
  //   if (playerElement) {
  //     playerElement.style.left = `${newPosition.x}px`;
  //     playerElement.style.top = `${newPosition.y}px`;
  //   }
  // }

  // function placeBombOnMap(position) {
  //   const bombElement = document.createElement('div');
  //   bombElement.className = 'bomb';
  //   bombElement.style.left = `${position.x}px`;
  //   bombElement.style.top = `${position.y}px`;
  //   mapSection.appendChild(bombElement);

  //   setTimeout(() => {
  //     // Handle bomb explosion logic here
  //     explodeBomb(bombElement, position);
  //   }, 3000);
  // }

  // function explodeBomb(bombElement, position) {
  //   mapSection.removeChild(bombElement);
  // }

  handleGameEnd() {
    stopGame();
  }
}

