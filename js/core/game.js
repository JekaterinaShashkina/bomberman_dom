import {
  boardSize,
  WALL,
  EMPTY,
  BOMB,
  BREAKABLE_WALL,
  PLAYER,
  board,
} from './const.js';
import { renderBoard } from './map.js';

let playerPosition = { x: 0, y: 0 };

// Initialize the game board
export const initializeBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      // Add walls on the borders and at even cells
      if (
        i === 0 ||
        i === boardSize - 1 ||
        j === 0 ||
        j === boardSize - 1 ||
        // (i % 2 === 0 && j % 2 === 0) ||
        Math.random() < 0.2
      ) {
        row.push(WALL);
      } else if (
        i % 2 === 1 &&
        j % 2 === 1 &&
        !(i === 1 && j === 1) &&
        Math.random() < 0.4
      ) {
        row.push(BREAKABLE_WALL);
      } else {
        row.push(EMPTY);
      }
    }
    board.push(row);
  }
  // Set player position
  playerPosition = { x: 1, y: 1 };
  board[playerPosition.y][playerPosition.x] = PLAYER;
};

// // Entry point
// const startGame = () => {
//   initializeBoard();
//   renderBoard();
// };

// // Start the game
// startGame();

export const handlePlayerMovement = (key) => {
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  if (key === 'ArrowUp' && playerPosition.y > 0) {
    newY -= 1;
  } else if (key === 'ArrowDown' && playerPosition.y < boardSize - 1) {
    newY += 1;
  } else if (key === 'ArrowLeft' && playerPosition.x > 0) {
    newX -= 1;
  } else if (key === 'ArrowRight' && playerPosition.x < boardSize - 1) {
    newX += 1;
  }

  // New position move avalaibility control
  if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL) {
    if (board[playerPosition.y][playerPosition.x] !== BOMB) {
      // renew player position
      board[playerPosition.y][playerPosition.x] = EMPTY;
    }
    playerPosition = { x: newX, y: newY };
    board[newY][newX] = PLAYER;

    // draw new game board
    renderBoard();
  }
  if (key === ' ' && board[playerPosition.y][playerPosition.x] !== BOMB) {
    placeBomb();
  }
};
const bombs = [];
const placeBomb = () => {
  const currentPlayerX = playerPosition.x;
  const currentPlayerY = playerPosition.y;

  //  place bomb on the current player position
  board[currentPlayerY][currentPlayerX] = BOMB;
  bombs.push({ x: currentPlayerX, y: currentPlayerY });
  console.log(bombs);
  // draw  new field
  renderBoard();

  // timer for bomb (3 sec)
  setTimeout(() => explodeBomb(currentPlayerX, currentPlayerY), 5000);
};

const explodeBomb = (x, y) => {
  // clean up the cell
  bombs.splice(
    bombs.findIndex((bomb) => bomb.x === x && bomb.y === y),
    1,
  );
  board[y][x] = EMPTY;
  // logic of effects to walls and player

  // draw new field
  renderBoard();
};
