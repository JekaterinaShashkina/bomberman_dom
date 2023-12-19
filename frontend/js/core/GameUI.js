import GameCore from './GameCore.js';

export default class GameUI {
  constructor(gameSetup) {
    // DOM Elements
    this.livesCount = document.getElementById('lives-count');
    this.bombCount = document.getElementById('bomb-count');
    this.flameCount = document.getElementById('flame-count');
    this.speedLevel = document.getElementById('speed-level');

    this.gameCore = new GameCore(this, gameSetup)

    // Handle keydown
    window.addEventListener('keydown', (event) => {
      const { key } = event;
      this.gameCore.handleKeyPress(key);
    });

    // Handle keyup
    window.addEventListener('keyup', () => {
      this.gameCore.resetCurrentKey()
    });
  }

  updatedLives(count) {
    this.livesCount.innerText = count
  }

  updatedBombCount(count) {
    this.bombCount.innerText = count
  }

  updatedFlameCount(count) {
    this.flameCount.innerText = count
  }

  updatedSpeedLevel(count) {
    this.speedLevel.innerText = count
  }
}
