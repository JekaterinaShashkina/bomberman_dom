import {
  boardSize,
  WALL,
  EMPTY,
  BOMB,
  BREAKABLE_WALL,
  PLAYER,
  EXPLOSION,
  board,
} from './const.js';
import { renderBoard } from './map.js';

let canPlaceBomb = true;
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
        (i % 2 === 0 && j % 2 === 0)
        // Math.random() < 0.2
      ) {
        row.push(WALL);
      } else if (
        i % 2 === 1 &&
        j % 2 === 1 &&
        !(i === 1 && j === 1) &&
        Math.random() < 0.6
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

  // New position move availability control
  if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL) {
    if (board[playerPosition.y][playerPosition.x] !== BOMB) {
      // Renew player position
      board[playerPosition.y][playerPosition.x] = EMPTY;
    }
    playerPosition = { x: newX, y: newY };
    board[newY][newX] = PLAYER;

    // Draw the new game board
    renderBoard();
  }
  if (
    key === ' ' &&
    canPlaceBomb &&
    board[playerPosition.y][playerPosition.x] !== BOMB
  ) {
    placeBomb();
    // Default bomb placement
    canPlaceBomb = false;
    setTimeout(() => {
      canPlaceBomb = true;
    }, 3000); // Timer set to 3000 so the player cannot place a bomb until the other bomb explodes
  }
};

const bombs = [0];
const placeBomb = () => {
  const currentPlayerX = playerPosition.x;
  const currentPlayerY = playerPosition.y;

  // Place a bomb on the current player's position
  board[currentPlayerY][currentPlayerX] = BOMB;
  bombs.push({ x: currentPlayerX, y: currentPlayerY });

  // Draw the new field
  renderBoard();

  // Timer for the bomb (3 sec)
  setTimeout(() => explodeBomb(currentPlayerX, currentPlayerY, 2), 3000);
};

// Define explosion directions
const directions = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const explodeBomb = (x, y, radius) => {
  const animateExplosion = () => {
    for (const direction of directions) {
      for (let i = 0; i <= radius; i++) {
        const targetX = x + direction.x * i;
        const targetY = y + direction.y * i;

        // Walls control
        if (board[targetY][targetX] === WALL) {
          break;
        }
        // Mark the cell as an explosion
        board[targetY][targetX] = EXPLOSION;

        if (board[targetY][targetX] === BOMB) {
          explodeBomb(targetX, targetY, explosionRadius);
        }
      }
    }

    // Clean up the cell
    bombs.splice(
      bombs.findIndex((bomb) => bomb.x === x && bomb.y === y),
      1
    );

    // Draw the new field
    renderBoard();
    

    // Call animateExplosion again, till the end of animation time
    if (animationFrameCounter < maxFrames) {
      requestAnimationFrame(animateExplosion);
      animationFrameCounter++;
    } else {
      // Clear the explosion
      for (const direction of directions) {
        for (let i = 0; i <= radius; i++) {
          const targetX = x + direction.x * i;
          const targetY = y + direction.y * i;
          if (board[targetY][targetX] === WALL) {
            break;
          }
          board[targetY][targetX] = EMPTY;
        }
      }
    }
  };

  let animationFrameCounter = 0;
  const maxFrames = 60;
  animateExplosion();
};

const clearExplosion = (x, y, explosionRadius) => {
  // Clear all cells
  for (const direction of directions) {
    for (let i = 0; i <= explosionRadius; i++) {
      const targetX = x + direction.x * i;
      const targetY = y + direction.y * i;
      board[targetY][targetX] = EMPTY;
    }
  }
  // Draw the field
  renderBoard();
};
