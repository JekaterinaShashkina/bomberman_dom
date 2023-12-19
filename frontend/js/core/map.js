import {
  board,
  BOMB,
  BREAKABLE_WALL,
  WALL,
  EXPLOSION,
  PLAYER,
  POWER_UP_BOMB,
  POWER_UP_SPEED,
  POWER_UP_FLAME,
  EXPLOSION_BREAKABLE_WALL,
} from '../../const.js';

// Render the game board
export const renderBoard = () => {
  const gameBoard = document.querySelector('.game-board');
  gameBoard.innerHTML = '';

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (board[i][j] === WALL) {
        cell.classList.add('wall');
      } else if (board[i][j] === PLAYER) {
        cell.classList.add('player');
      } else if (board[i][j] === BOMB) {
        cell.classList.add('bomb');
      } else if (board[i][j] === EXPLOSION || board[i][j] === EXPLOSION_BREAKABLE_WALL) {
        cell.classList.add('explosion');
      } else if (board[i][j] === POWER_UP_BOMB) {
        cell.classList.add('power-up-bomb-count');
      } else if (board[i][j] === POWER_UP_SPEED) {
        cell.classList.add('power-up-speed-count');
      } else if (board[i][j] === POWER_UP_FLAME) {
        cell.classList.add('power-up-flame-count');
      } else if (board[i][j] === BREAKABLE_WALL) {
        cell.classList.add('breakable-wall');
      }

      gameBoard.append(cell);
    }
  }
};
