import frame from '../../framework/framework.js';
import GameCore from './GameCore.js';

export default class GameUI {
  constructor(gameSetup) {
    this.game = document.getElementById("game-container")
    const elements = this.createGameElements(this.game)
    this.livesCount = elements.livesCount;
    this.bombCount = elements.bombCount
    this.flameCount = elements.flameCount
    this.speedLevel = elements.speedLevel
    this.player = gameSetup.player

    this.gameCore = new GameCore(this, gameSetup)

    // Handle keydown
    window.keydown((event) => {
      const { key } = event;
      this.gameCore.handleKeyPress(key);
    });

    // Handle keyup
    window.keyup(() => {
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

  createGameElements(container) {
    const livesCount = frame.createSpan({ id: 'lives-count' }, "3")
    const bombCount = frame.createSpan({ id: 'bomb-count' }, "1")
    const flameCount = frame.createSpan({ id: 'flame-count' }, "1")
    const speedLevel = frame.createSpan({ id: 'speed-level' }, "1")

    container.append(
      frame.createDiv({ class: 'game-board' }),
      frame.createAside({ id: 'game-info' },
        frame.createBr({}),
        frame.createDiv({ id: 'lives' },
          "Lives: ",
          livesCount,
        ),
        frame.createDiv({
          id: 'powerups'
        },
          "Bombs: ",
          bombCount,
          " Flames: ",
          flameCount,
          " Speed: ",
          speedLevel,
        ),
        frame.createButton({ id: 'start-pause' }, "Start")
      )
    )

    return {
      livesCount: livesCount,
      bombCount: bombCount,
      flameCount: flameCount,
      speedLevel: speedLevel,
    }
  }
}
