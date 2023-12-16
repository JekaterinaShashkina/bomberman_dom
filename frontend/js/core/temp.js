import { renderBoard } from './map.js';
import webSocketService from '../utils/websocket.js';
import { handlePlayerMovement, initializeBoard } from './game.js';

let mapSection,
  gameContainer,
  livesCount,
  bombCount,
  flameCount,
  speedLevel,
  chatInput,
  sendButton,
  messagesDiv;
  
document.addEventListener('DOMContentLoaded', function () {
  // Connect to WebSocket
  webSocketService.connect();
  // DOM Elements
  mapSection = document.getElementById('map');
  gameContainer = document.getElementById('game-container');
  livesCount = document.getElementById('lives-count');
  bombCount = document.getElementById('bomb-count');
  flameCount = document.getElementById('flame-count');
  speedLevel = document.getElementById('speed-level');
  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-button');
  messagesDiv = document.getElementById('messages');
  // Initialize game elements
  initGame();
  // Event listeners
  sendButton.addEventListener('click', sendChatMessage);
  webSocketService.addMessageHandler(handleWebSocketMessage);
});
// Handle keydown
window.addEventListener('keydown', (event) => {
  const { key } = event;
  handlePlayerMovement(key);
});
export function initGame() {
  initializeBoard();
  renderBoard(mapSection);
}
function handleWebSocketMessage(data) {
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
      displayChatMessage(data.sender, data.text);
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
function sendChatMessage() {
  const chatMessage = chatInput.value.trim();
  if (!chatMessage) return;
  webSocketService.send({
    type: 'chat-message',
    text: chatMessage,
  });
  chatInput.value = ''; // Clear chat input after sending
}
function displayChatMessage(sender, message) {
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
function handleGameEnd(winner) {
  stopGame();
}