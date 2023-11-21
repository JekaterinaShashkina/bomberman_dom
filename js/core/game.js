// import {
//   boardSize,
//   WALL,
//   EMPTY,
//   BOMB,
//   BREAKABLE_WALL,
//   PLAYER,
//   EXPLOSION,
//   board,
// } from './const.js';
// import { renderBoard } from './map.js';

// let canPlaceBomb = true;
// let playerPosition = { x: 0, y: 0 };

// // Initialize the game board
// export const initializeBoard = () => {
//   for (let i = 0; i < boardSize; i++) {
//     const row = [];
//     for (let j = 0; j < boardSize; j++) {
//       // Add walls on the borders and at even cells
//       if (
//         i === 0 ||
//         i === boardSize - 1 ||
//         j === 0 ||
//         j === boardSize - 1 ||
//         (i % 2 === 0 && j % 2 === 0)
//         // Math.random() < 0.2
//       ) {
//         row.push(WALL);
//       } else if (
//         i % 2 === 1 &&
//         j % 2 === 1 &&
// !(i === 1 && j === 1) &&
//         Math.random() < 0.6
//       ) {
//         row.push(BREAKABLE_WALL);
//       } else {
//         row.push(EMPTY);
//       }
//     }
//     board.push(row);
//     console.log(board);
//     // return board;
//   }
//   // Set player position
//   playerPosition = { x: 1, y: 1 };
//   board[playerPosition.y][playerPosition.x] = PLAYER;
// };

// export const handlePlayerMovement = (key) => {
//   let newX = playerPosition.x;
//   let newY = playerPosition.y;

//   if (key === 'ArrowUp' && playerPosition.y > 0) {
//     newY -= 1;
//   } else if (key === 'ArrowDown' && playerPosition.y < boardSize - 1) {
//     newY += 1;
//   } else if (key === 'ArrowLeft' && playerPosition.x > 0) {
//     newX -= 1;
//   } else if (key === 'ArrowRight' && playerPosition.x < boardSize - 1) {
//     newX += 1;
//   }

//   // New position move availability control
//   if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL) {
//     if (board[playerPosition.y][playerPosition.x] !== BOMB) {
//       // Renew player position
//       board[playerPosition.y][playerPosition.x] = EMPTY;
//     }
//     playerPosition = { x: newX, y: newY };
//     board[newY][newX] = PLAYER;

//     // Draw the new game board
//     renderBoard();
//   }
//   if (
//     key === ' ' &&
//     canPlaceBomb &&
//     board[playerPosition.y][playerPosition.x] !== BOMB
//   ) {
//     placeBomb();
//     // Default bomb placement
//     canPlaceBomb = false;
//     setTimeout(() => {
//       canPlaceBomb = true;
//     }, 3000); // Timer set to 3000 so the player cannot place a bomb until the other bomb explodes
//   }
// };

// const bombs = [0];
// const placeBomb = () => {
//   const currentPlayerX = playerPosition.x;
//   const currentPlayerY = playerPosition.y;

//   // Place a bomb on the current player's position
//   board[currentPlayerY][currentPlayerX] = BOMB;
//   bombs.push({ x: currentPlayerX, y: currentPlayerY });

//   // Draw the new field
//   renderBoard();

//   // Timer for the bomb (3 sec)
//   setTimeout(() => explodeBomb(currentPlayerX, currentPlayerY, 2), 3000);
// };

// // Define explosion directions
// const directions = [
//   { x: 0, y: 1 },
//   { x: 0, y: -1 },
//   { x: 1, y: 0 },
//   { x: -1, y: 0 },
// ];

// const explodeBomb = (x, y, radius) => {
//   const animateExplosion = () => {
//     for (const direction of directions) {
//       for (let i = 0; i <= radius; i++) {
//         const targetX = x + direction.x * i;
//         const targetY = y + direction.y * i;

//         // Walls control
//         if (board[targetY][targetX] === WALL) {
//           break;
//         }
//         // Mark the cell as an explosion
//         board[targetY][targetX] = EXPLOSION;

//         if (board[targetY][targetX] === BOMB) {
//           explodeBomb(targetX, targetY, explosionRadius);
//         }
//       }
//     }

//     // Clean up the cell
//     bombs.splice(
//       bombs.findIndex((bomb) => bomb.x === x && bomb.y === y),
//       1,
//     );

//     // Draw the new field
//     renderBoard();

//     // Call animateExplosion again, till the end of animation time
//     if (animationFrameCounter < maxFrames) {
//       requestAnimationFrame(animateExplosion);
//       animationFrameCounter++;
//     } else {
//       // Clear the explosion
//       for (const direction of directions) {
//         for (let i = 0; i <= radius; i++) {
//           const targetX = x + direction.x * i;
//           const targetY = y + direction.y * i;
//           if (board[targetY][targetX] === WALL) {
//             break;
//           }
//           board[targetY][targetX] = EMPTY;
//         }
//       }
//     }
//   };

//   let animationFrameCounter = 0;
//   const maxFrames = 60;
//   animateExplosion();
// };
import {
  boardSize,
  WALL,
  EMPTY,
  BOMB,
  BREAKABLE_WALL,
  PLAYER,
  EXPLOSION,
  POWER_UP_BOMB_COUNT,
  POWER_UP_SPEED_COUNT,
  board,
} from './const.js';
import { renderBoard } from './map.js';

let lives = document.querySelector('#lives-count');
let playerPosition = { x: 0, y: 0 };
const bombs = [];
const animationDuration = 500; // in milliseconds
const framesPerSecond = 60;
const totalFrames = (animationDuration / 1000) * framesPerSecond;
let animationFrameId;
let placeBombFlag = false;
let isBombPlaced = false;
let playerLives = 3;

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
      ) {
        row.push(WALL);
      } else if (
        i % 2 === 1 &&
        j % 2 === 1 &&
        !(i === 1 && j === 1) &&
        Math.random() < 0.8
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

const getRandomPowerUpType = () => {
  const powerUps = [POWER_UP_BOMB_COUNT, POWER_UP_SPEED_COUNT];
  const randomIndex = Math.floor(Math.random() * powerUps.length);
  const selectedPowerUp = powerUps[randomIndex];
  console.log('Selected Power-Up:', selectedPowerUp);
  return selectedPowerUp;
};

const animateStep = (startTime, startX, startY, endX, endY) => {
  const currentTime = Date.now();
  const progress = (currentTime - startTime) / animationDuration;
  const deltaX = (endX - startX) / totalFrames;
  const deltaY = (endY - startY) / totalFrames;

  if (progress < 1) {
    const interpolatedX = startX + progress * deltaX;
    const interpolatedY = startY + progress * deltaY;

    const roundedX = Math.round(interpolatedX);
    const roundedY = Math.round(interpolatedY);

    if (board[roundedY][roundedX] !== BOMB) {
      board[roundedY][roundedX] = EMPTY;
    }

    playerPosition.x = interpolatedX;
    playerPosition.y = interpolatedY;

    renderBoard();
    if (placeBombFlag) {
      placeBomb();
      placeBombFlag = false;
    }

    // Запустить следующий шаг анимации
    requestAnimationFrame((newTime) =>
      animateStep(newTime, startX, startY, endX, endY),
    );
  } else {
    // Finish animation and update player position
    const roundedX = Math.round(endX);
    const roundedY = Math.round(endY);

    if (
      board[roundedY][roundedX] !== WALL &&
      board[roundedY][roundedX] !== BREAKABLE_WALL &&
      board[roundedY][roundedX] !== BOMB
    ) {
      playerPosition.x = roundedX;
      playerPosition.y = roundedY;
      board[roundedY][roundedX] = PLAYER;
    }

    renderBoard();
  }
};

export const handlePlayerMovement = (key) => {
  let newX = playerPosition.x;
  let newY = playerPosition.y;
  console.log(key);
  if (key === 'ArrowUp' && playerPosition.y > 0) {
    newY -= 1;
  } else if (key === 'ArrowDown' && playerPosition.y < boardSize - 1) {
    newY += 1;
  } else if (key === 'ArrowLeft' && playerPosition.x > 0) {
    newX -= 1;
  } else if (key === 'ArrowRight' && playerPosition.x < boardSize - 1) {
    newX += 1;
  } else if (key === ' ') {
    // If space is pressed, set the flag to place a bomb
    placeBombFlag = true;
  }

  console.log(newX, newY);
  // New position move avalaibility control
  if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL) {
    const startTime = Date.now();
    const startX = playerPosition.x;
    const startY = playerPosition.y;

    // Animation start
    animationFrameId = requestAnimationFrame(() =>
      animateStep(startTime, startX, startY, newX, newY),
    );
  }
};

const placeBomb = () => {
  if (!isBombPlaced) {
    const currentPlayerX = playerPosition.x;
    const currentPlayerY = playerPosition.y;

    //  place bomb on the current player position
    board[currentPlayerY][currentPlayerX] = BOMB;
    bombs.push({ x: currentPlayerX, y: currentPlayerY });
    console.log(board[currentPlayerY][currentPlayerX]);

    isBombPlaced = true;
    // draw  new field
    renderBoard();
    // timer for bomb (3 sec)
    console.log(board[currentPlayerY][currentPlayerX]);
    setTimeout(() => {
      explodeBomb(currentPlayerX, currentPlayerY, 1);
      isBombPlaced = false;
    }, 3000);
  }
};
// define explosion directions
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
        // Check if player is in the explosion area
        if (targetX === playerPosition.x && targetY === playerPosition.y) {
          playerDies(); // Вызываем функцию обработки смерти
          // return;
        }

        if (board[targetY][targetX] === BREAKABLE_WALL) {
          if (Math.random() < 0.3) {
            const powerUpType = getRandomPowerUpType();
            board[targetY][targetX] = powerUpType;
          } else {
            board[targetY][targetX] = EMPTY;
          }
        } else {
          // Mark cell as explosion
          board[targetY][targetX] = EXPLOSION;
        }

        if (
          board[targetY][targetX] === BOMB ||
          board[targetY][targetX] === PLAYER
        ) {
          explodeBomb(targetX, targetY, explosionRadius);
        }
      }
    }
    // Draw new field
    renderBoard();

    // Call animateExplosion again until the end of the animation time
    if (animationFrameCounter < maxFrames) {
      requestAnimationFrame(animateExplosion);
      animationFrameCounter++;
    } else {
      // Set timeout to remove the explosion after a certain time
      setTimeout(() => {
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
        renderBoard();
      }, 500); // Adjust the time as needed
    }
  };

  let animationFrameCounter = 0;
  const maxFrames = 60;
  animateExplosion();
};
const resetPlayerPosition = () => {
  playerPosition = { x: 1, y: 1 };
  board[playerPosition.y][playerPosition.x] = PLAYER;
};
const playerDies = () => {
  playerLives--;

  if (playerLives <= 0) {
    lives.textContent = 'You die. The end of game';
  } else {
    resetPlayerPosition();
    console.log(playerLives);
    renderBoard();
    lives.textContent = playerLives;
  }
};
