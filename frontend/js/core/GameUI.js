import { renderBoard } from './map.js';
import { handlePlayerMovement, setBoard } from './game.js';

export default class GameUI {
  constructor(startBoard) {
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

    // Handle keydown
    window.addEventListener('keydown', (event) => {
      const { key } = event;
      handlePlayerMovement(key);
    });
  }

  initGame(startBoard) {
    setBoard(startBoard)
    renderBoard();
  }

  handleGameEnd() {
    stopGame();
  }
}
