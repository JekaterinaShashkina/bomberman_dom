import GameCore from './GameCore.js';

export default class GameUI {
  constructor(gameSetup) {
    // DOM Elements
    this.mapSection = document.getElementById('map');
    this.gameContainer = document.getElementById('game-container');
    this.chatInput = document.getElementById('chat-input');
    this.sendButton = document.getElementById('send-button');
    this.messagesDiv = document.getElementById('messages');

    // Event listeners
    this.sendButton.addEventListener('click', this.sendChatMessage);

    this.gameCore = new GameCore(gameSetup)

    // Handle keydown
    window.addEventListener('keydown', (event) => {
      const { key } = event;
      this.gameCore.handlePlayerMovement(key);
    });
  }
}
