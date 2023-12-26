import UpdateManager from './UpdateManager.js';
import {
  boardSize,
  DEFAULT_PLAYER_SPEED,
  PLAYER_LIVES,
  board,
} from '../../const.js';
import { renderBoard } from './map.js';

export default class GameCore {
  constructor(gameUI, gameSetup) {
    this.gameUI = gameUI
    this.updateGameState = new UpdateManager(this, this.gameUI)
    this.playerId = gameSetup.player.id
    this.setBoard(gameSetup.startBoard)

    this.playerLives = PLAYER_LIVES
    this.playerSpeed = DEFAULT_PLAYER_SPEED

    this.currentKey
    this.blockMovement = false
    this.renderBoardToggle = false

    requestAnimationFrame(this.gameLoop)
  }

  setBoard = (startBoard) => {
    startBoard.forEach(row => board.push(row))
    renderBoard()
  }

  updateBoard = (startBoard) => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        board[i][j] = startBoard[i][j]
      }
    }
    this.renderBoardToggle = true
  }

  handleKeyPress = (key) => {
    if (this.playerLives > 0) {
      if (key === ' ') {
        this.updateGameState.placeBomb({ playerId: this.playerId })
      } else if (this.isValidKey(key)) {
        this.currentKey = key
      } else {
        this.currentKey = ''
      }
    }
  };

  isValidKey(key) {
    return key === 'ArrowUp' || key === 'ArrowDown'
      || key === 'ArrowLeft' || key === 'ArrowRight'
  }

  resetCurrentKey = () => {
    this.currentKey = ''
  }

  updateSpeed = (speed) => {
    this.playerSpeed = speed
  }

  updateLives = (lives) => {
    this.playerLives = lives
  }

  gameLoop = () => {
    if (!this.blockMovement && this.isValidKey(this.currentKey)) {
      // Handle player movement delay
      this.blockMovement = true
      setTimeout(() => {
        this.blockMovement = false
      }, 200 / this.playerSpeed)

      this.updateGameState.movePlayer({
        playerId: this.playerId, direction: this.currentKey
      })
    }

    if (this.renderBoardToggle) {
      this.renderBoardToggle = false
      renderBoard()
    }

    requestAnimationFrame(this.gameLoop)
  }
}
