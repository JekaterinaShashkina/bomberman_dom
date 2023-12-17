import GameState from './GameState.js';
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
  POWER_UP_FLAME_COUNT,
  board,
} from './const.js';
import { renderBoard } from './map.js';

const DEFAULT_EXPLOSION_RADIUS = 1;
const bombs = [];
const maxBombsCount = 5
const updateGameState = new GameState()
export const playerPosition = { x: 1, y: 1 };

let lives = document.querySelector('#lives-count');
let placeBombFlag = false;
let isBombPlaced = false;
let playerLives = 3;
let bombCountPowerUpActive = false;
let explosionRadius = DEFAULT_EXPLOSION_RADIUS;
let playerSpeed = 1;

export const setBoard = (startBoard) => {
  for (let i = 0; i < startBoard.length; i++) {
    board.push(startBoard[i]);
  }
}

const powerUpsTypes = [
  POWER_UP_BOMB_COUNT,
  POWER_UP_SPEED_COUNT,
  POWER_UP_FLAME_COUNT,
];

const powerUps = [];

const getRandomPowerUpType = () => {
  const selectedPowerUp =
    powerUpsTypes[Math.floor(Math.random() * powerUpsTypes.length)];
  console.log('Selected Power-Up:', selectedPowerUp);
  return selectedPowerUp;
};

const placePowerUp = (x, y) => {
  if (board[y][x] === EMPTY) {
    board[y][x] = getRandomPowerUpType();
    renderBoard();
  }
  powerUps.push({ x, y, type: board[y][x] });
  console.log(...powerUps);
};

const collectPowerUp = () => {
  const currentPlayerX = Math.round(playerPosition.x);
  const currentPlayerY = Math.round(playerPosition.y);

  for (let i = 0; i < powerUps.length; i++) {
    const powerUp = powerUps[i];
    if (powerUp.x === currentPlayerX && powerUp.y === currentPlayerY) {
      // Apply the effect of the power-up
      applyPowerUpEffect(powerUp.type);

      // Remove the collected power-up
      powerUps.splice(i, 1);
      renderBoard();
      break; // Stop searching for power-ups once one is collected
    }
  }
};

const applyPowerUpEffect = (powerUpType) => {
  switch (powerUpType) {
    case POWER_UP_BOMB_COUNT:
      console.log('Bomb count +');
      bombCountPowerUpActive = true;
      const powerUpStartTime = performance.now();
      const updateBombCountEffect = (timestamp) => {
        const elapsedTime = timestamp - powerUpStartTime;
        if (elapsedTime < 30000) {
          requestAnimationFrame(updateBombCountEffect);
        } else {
          bombCountPowerUpActive = false;
        }
      };
      requestAnimationFrame(updateBombCountEffect);
      break;
    case POWER_UP_SPEED_COUNT:
      console.log('speed up');
      playerSpeed = 4;
      const originalPlayerSpeed = 1;
      const speedEffectStartTime = performance.now();
      const updateSpeedEffect = (timestamp) => {
        const elapsedTime = timestamp - speedEffectStartTime;
        if (elapsedTime < 30000) {
          requestAnimationFrame(updateSpeedEffect);
        } else {
          playerSpeed = originalPlayerSpeed;
        }
      };
      requestAnimationFrame(updateSpeedEffect);
      break;
    case POWER_UP_FLAME_COUNT:
      console.log('flame increase');
      explosionRadius++;
      const originalExplosionRadius = DEFAULT_EXPLOSION_RADIUS;
      const flameEffectStartTime = performance.now();
      const updateFlameEffect = (timestamp) => {
        const elapsedTime = timestamp - flameEffectStartTime;
        if (elapsedTime < 30000) {
          requestAnimationFrame(updateFlameEffect);
        } else {
          explosionRadius = originalExplosionRadius;
        }
      };
      requestAnimationFrame(updateFlameEffect);
      break;
    // Add more cases for other power-up types if needed
  }
};

const gameLoop = () => {
  renderBoard()
  requestAnimationFrame(gameLoop)
}

gameLoop()

const animateStep = (startX, startY, endX, endY) => {

  renderBoard();
  if (placeBombFlag) {
    placeBomb();
    placeBombFlag = false;
  }

  if (
    board[endY][endX] !== WALL &&
    board[endY][endX] !== BREAKABLE_WALL &&
    board[endY][endX] !== BOMB
  ) {
    playerPosition.x = endX;
    playerPosition.y = endY;

    updateGameState.movePlayer({
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY
    })
  }
};

export const movePlayer = (startX, startY, endX, endY) => {
  if (board[startY][startX] !== BOMB) {
    board[startY][startX] = EMPTY;
  }

  board[endY][endX] = PLAYER;
}

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
  } else if (key === ' ') {
    // If space is pressed, set the flag to place a bomb
    placeBombFlag = true;
  }

  // New position move avalaibility control
  if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL
    && board[newY][newX] !== BOMB && board[newY][newX] !== PLAYER) {
    const startX = playerPosition.x;
    const startY = playerPosition.y;

    // Animation start
    animateStep(startX, startY, newX, newY)
    // Collect power-ups
    collectPowerUp();
  }
};

const placeBomb = () => {
  if (
    (!isBombPlaced && !bombCountPowerUpActive) ||
    (bombCountPowerUpActive && bombs.length < maxBombsCount)
  ) {
    const currentPlayerX = playerPosition.x;
    const currentPlayerY = playerPosition.y;

    //  place bomb on the current player position
    board[currentPlayerY][currentPlayerX] = BOMB;
    bombs.push({ x: currentPlayerX, y: currentPlayerY });
    console.log(currentPlayerY, currentPlayerX);
    console.log(...bombs);
    isBombPlaced = true;
    // draw  new field
    renderBoard();
    // timer for bomb (3 sec)
    console.log(board[currentPlayerY][currentPlayerX]);
    setTimeout(() => {
      explodeBomb(currentPlayerX, currentPlayerY, explosionRadius);
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
          explodeBomb(targetX, targetY);
        }
      }
    }
    // Draw new field
    renderBoard();

    // Call animateExplosion again until the end of animation time
    if (animationFrameCounter < maxFrames) {
      requestAnimationFrame(animateExplosion);
      animationFrameCounter++;
    } else {
      // for (const direction of directions) {
      //   for (let i = 0; i <= radius; i++) {
      //     const targetX = x + direction.x * i;
      //     const targetY = y + direction.y * i;
      //     console.log(board[targetY][targetX]);
      //     if (board[targetY][targetX] === WALL) {
      //       break;
      //     }
      //     board[targetY][targetX] = EMPTY;
      //   }
      // }
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
        placePowerUp(x, y);
        renderBoard();
      }, 500); // Adjust the time as needed
    }
  };
  // bombs.splice(
  const i = bombs.findIndex((bomb) => bomb.x === x && bomb.y === y);
  console.log(i);
  bombs.splice(i, 1);
  //   1,
  // );
  console.log(bombs);
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
    lives.innerHTML = 'You die. The end of game';
  } else {
    resetPlayerPosition();
    renderBoard();
    lives.innerHTML = playerLives;
  }
};
