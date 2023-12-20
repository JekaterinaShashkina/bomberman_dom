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
  EMPTY,
  boardSize,
} from '../../const.js';

const gameBoard = document.querySelector('.game-board');

// Render the game board
export const renderBoard = () => {
  if (gameBoard.innerHTML === '') {
    createBoard()
  }
  updateBoard()
};

function updateBoard() {
  const cells = gameBoard.children
  let index = 0

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const cell = cells[index]
      cell.classList.add('cell');

      if (board[i][j] === WALL && !cell.classList.contains('wall')) {
        cell.setAttribute('class', 'cell wall')
      } else if (board[i][j] === PLAYER && !cell.classList.contains('player')) {
        cell.setAttribute('class', 'cell player')
      } else if (board[i][j] === BOMB && !cell.classList.contains('bomb')) {
        cell.setAttribute('class', 'cell bomb')
      } else if (board[i][j] === EXPLOSION || board[i][j] === EXPLOSION_BREAKABLE_WALL && !cell.classList.contains('explosion')) {
        cell.setAttribute('class', 'cell explosion')
      } else if (board[i][j] === POWER_UP_BOMB && !cell.classList.contains('power-up-bomb-count')) {
        cell.setAttribute('class', 'cell power-up-bomb-count')
      } else if (board[i][j] === POWER_UP_SPEED && !cell.classList.contains('power-up-speed-count')) {
        cell.setAttribute('class', 'cell power-up-speed-count')
      } else if (board[i][j] === POWER_UP_FLAME && !cell.classList.contains('power-up-flame-count')) {
        cell.setAttribute('class', 'cell power-up-flame-count')
      } else if (board[i][j] === BREAKABLE_WALL && !cell.classList.contains('breakable-wall')) {
        cell.setAttribute('class', 'cell breakable-wall')
      } else if (board[i][j] === EMPTY && cell.getAttribute('class') !== 'cell') {
        cell.setAttribute('class', 'cell')
      }

      index++;
    }
  }
}

function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    gameBoard.append(cell);
  }
}
