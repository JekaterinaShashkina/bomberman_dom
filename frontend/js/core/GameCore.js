import UpdateManager from './UpdateManager.js';
import Bomb from './Bomb.js';
import {
  boardSize,
  WALL,
  BOMB,
  BREAKABLE_WALL,
  PLAYER,
  EXPLOSION,
  POWER_UP_BOMB,
  POWER_UP_SPEED,
  POWER_UP_FLAME,
  DEFAULT_EXPLOSION_RADIUS,
  DEFAULT_PLAYER_SPEED,
  MAX_BOMBS_COUNT,
  POWER_UP_DURATION,
  PLAYER_LIVES,
  BOMB_EXPLOSION_DELAY,
  MAX_PLAYER_SPEED,
  board,
} from '../../const.js';
import { renderBoard } from './map.js';

export default class GameCore {
  powerUpsTypes = [
    POWER_UP_BOMB,
    POWER_UP_SPEED,
    POWER_UP_FLAME,
  ];

  constructor(gameUI, gameSetup) {
    this.gameUI = gameUI
    this.updateGameState = new UpdateManager(this)
    this.playerStartPosition = Object.assign({}, gameSetup.startPosition);
    this.playerPosition = gameSetup.startPosition
    this.setBoard(gameSetup.startBoard)

    this.bombsPlaced = 0
    this.currentMaxBombs = 1
    this.playerLives = PLAYER_LIVES;
    this.explosionRadius = DEFAULT_EXPLOSION_RADIUS;
    this.playerSpeed = DEFAULT_PLAYER_SPEED;

    this.currentKey
    this.blockMovement = false

    requestAnimationFrame(this.playerMovementLoop)
  }

  setBoard = (startBoard) => {
    startBoard.forEach(row => board.push(row))
    renderBoard()
  }

  updateBoard = (startBoard) => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (startBoard[i][j] === EXPLOSION && board[i][j] == PLAYER
          && this.playerPosition.x == j && this.playerPosition.y == i) {
          // Check if current player is in explosion in new game update
          this.playerDies()
        }
        board[i][j] = startBoard[i][j]
      }
    }
    renderBoard()
  }

  handleKeyPress = (key) => {
    if (this.playerLives > 0) {
      if (key === ' ') {
        // If space is pressed, set the flag to place a bomb
        this.placeBomb();
      } else if (key === 'ArrowUp' || key === 'ArrowDown'
        || key === 'ArrowLeft' || key === 'ArrowRight') {
        this.currentKey = key
      } else {
        this.currentKey = ''
      }
    }
  };

  resetCurrentKey = () => {
    this.currentKey = ''
  }

  playerMovementLoop = () => {
    const startX = this.playerPosition.x
    const startY = this.playerPosition.y
    let newX = startX;
    let newY = startY;

    if (this.currentKey === 'ArrowUp' && startY > 1) {
      newY -= 1;
    } else if (this.currentKey === 'ArrowDown' && startY < boardSize - 1) {
      newY += 1;
    } else if (this.currentKey === 'ArrowLeft' && startX > 1) {
      newX -= 1;
    } else if (this.currentKey === 'ArrowRight' && startX < boardSize - 1) {
      newX += 1;
    }

    if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL
      && board[newY][newX] !== BOMB && board[newY][newX] !== PLAYER) {
      if ((startX !== newX || startY !== newY) && !this.blockMovement) {
        // Handle player movement delay
        this.blockMovement = true
        setTimeout(() => {
          this.blockMovement = false
        }, 200 / this.playerSpeed)

        this.moveCurrentPlayer(newX, newY)
      }
    }

    requestAnimationFrame(this.playerMovementLoop)
  }

  moveCurrentPlayer(newX, newY) {
    if (this.playerLives > 0) {
      if (board[newY][newX] === EXPLOSION) {
        this.playerDies()
      } else {
        const currentX = this.playerPosition.x
        const currentY = this.playerPosition.y
        this.playerPosition.x = newX
        this.playerPosition.y = newY

        this.collectPowerUp(newX, newY)

        this.updateGameState.movePlayer({
          startX: currentX,
          startY: currentY,
          newX: newX,
          newY: newY
        })
      }
    }
  }

  collectPowerUp = (newX, newY) => {
    if (this.powerUpsTypes.includes(board[newY][newX])) {
      this.applyPowerUpEffect(board[newY][newX])
    }
  };

  applyPowerUpEffect = (powerUpType) => {
    switch (powerUpType) {
      case POWER_UP_BOMB:
        if (this.currentMaxBombs < MAX_BOMBS_COUNT) {
          this.currentMaxBombs++;
          this.gameUI.updatedBombCount(this.currentMaxBombs)
          setTimeout(() => {
            this.currentMaxBombs--
            this.gameUI.updatedBombCount(this.currentMaxBombs)
          }, POWER_UP_DURATION)
        }
        break;
      case POWER_UP_SPEED:
        if (this.playerSpeed < MAX_PLAYER_SPEED) {
          this.playerSpeed++;
          this.gameUI.updatedSpeedLevel(this.playerSpeed)
          setTimeout(() => {
            this.playerSpeed--
            this.gameUI.updatedSpeedLevel(this.playerSpeed)
          }, POWER_UP_DURATION)
        }
        break;
      case POWER_UP_FLAME:
        this.explosionRadius++;
        this.gameUI.updatedFlameCount(this.explosionRadius)
        setTimeout(() => {
          this.explosionRadius--
          this.gameUI.updatedFlameCount(this.explosionRadius)
        }, POWER_UP_DURATION)
        break;
    }
  };

  placeBomb = () => {
    if (
      (this.bombsPlaced < this.currentMaxBombs)
    ) {
      const currentX = this.playerPosition.x;
      const currentY = this.playerPosition.y;
      const bomb = new Bomb(currentX, currentY, this.explosionRadius)

      this.bombsPlaced++;
      this.updateGameState.placeBomb(bomb)
      setTimeout(() => {
        this.bombsPlaced--;
      }, BOMB_EXPLOSION_DELAY);
    }
  };

  playerDies = () => {
    this.playerLives--;

    if (this.playerLives <= 0) {
      this.gameUI.updatedLives('You die. The end of game')
      this.updateGameState.playerDies({
        x: this.playerPosition.x,
        y: this.playerPosition.y,
      })
    } else {
      this.gameUI.updatedLives(this.playerLives)
      this.moveCurrentPlayer(this.playerStartPosition.x, this.playerStartPosition.y)
    }
  };
}
