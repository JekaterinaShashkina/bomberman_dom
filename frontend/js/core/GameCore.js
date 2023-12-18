import UpdateManager from './UpdateManager.js';
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
  DEFAULT_EXPLOSION_RADIUS,
  DEFAULT_PLAYER_SPEED,
  MAX_BOMBS_COUNT,
  board,
} from './const.js';
import { renderBoard } from './map.js';

export default class GameCore {
  constructor(gameSetup) {
    this.bombs = [];
    this.maxBombsCount = 5
    this.updateGameState = new UpdateManager(this)
    this.playerPosition = gameSetup.startPosition
    this.setBoard(gameSetup.startBoard)

    this.lives = document.querySelector('#lives-count');
    this.placeBombFlag = false;
    this.isBombPlaced = false;
    this.playerLives = 3;
    this.bombCountPowerUpActive = false;
    this.explosionRadius = DEFAULT_EXPLOSION_RADIUS;
    this.playerSpeed = 1;

    this.powerUpsTypes = [
      POWER_UP_BOMB_COUNT,
      POWER_UP_SPEED_COUNT,
      POWER_UP_FLAME_COUNT,
    ];

    this.powerUps = [];

    this.directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];

    this.gameLoop()
  }

  setBoard = (startBoard) => {
    for (let i = 0; i < startBoard.length; i++) {
      board.push(startBoard[i]);
    }
  }


  getRandomPowerUpType = () => {
    const selectedPowerUp =
    this.powerUpsTypes[Math.floor(Math.random() * this.powerUpsTypes.length)];
    console.log('Selected Power-Up:', selectedPowerUp);
    return selectedPowerUp;
  };

  placePowerUp = (x, y) => {
    if (board[y][x] === EMPTY) {
      board[y][x] = this.getRandomPowerUpType();
      renderBoard();
    }
    this.powerUps.push({ x, y, type: board[y][x] });
    console.log(...this.powerUps);
  };

  collectPowerUp = () => {
    const currentPlayerX = Math.round(this.playerPosition.x);
    const currentPlayerY = Math.round(this.playerPosition.y);

    for (let i = 0; i < this.powerUps.length; i++) {
      const powerUp = this.powerUps[i];
      if (powerUp.x === currentPlayerX && powerUp.y === currentPlayerY) {
        // Apply the effect of the power-up
        this.applyPowerUpEffect(powerUp.type);

        // Remove the collected power-up
        this.powerUps.splice(i, 1);
        renderBoard();
        break; // Stop searching for power-ups once one is collected
      }
    }
  };

  applyPowerUpEffect = (powerUpType) => {
    switch (powerUpType) {
      case POWER_UP_BOMB_COUNT:
        console.log('Bomb count +');
        this.bombCountPowerUpActive = true;
        const powerUpStartTime = performance.now();
        const updateBombCountEffect = (timestamp) => {
          const elapsedTime = timestamp - powerUpStartTime;
          if (elapsedTime < 30000) {
            requestAnimationFrame(updateBombCountEffect);
          } else {
            this.bombCountPowerUpActive = false;
          }
        };
        requestAnimationFrame(updateBombCountEffect);
        break;
      case POWER_UP_SPEED_COUNT:
        console.log('speed up');
        this.playerSpeed = 4;
        const speedEffectStartTime = performance.now();
        const updateSpeedEffect = (timestamp) => {
          const elapsedTime = timestamp - speedEffectStartTime;
          if (elapsedTime < 30000) {
            requestAnimationFrame(updateSpeedEffect);
          } else {
            this.playerSpeed = DEFAULT_PLAYER_SPEED;
          }
        };
        requestAnimationFrame(updateSpeedEffect);
        break;
      case POWER_UP_FLAME_COUNT:
        console.log('flame increase');
        this.explosionRadius++;
        const originalExplosionRadius = DEFAULT_EXPLOSION_RADIUS;
        const flameEffectStartTime = performance.now();
        const updateFlameEffect = (timestamp) => {
          const elapsedTime = timestamp - flameEffectStartTime;
          if (elapsedTime < 30000) {
            requestAnimationFrame(updateFlameEffect);
          } else {
            this.explosionRadius = originalExplosionRadius;
          }
        };
        requestAnimationFrame(updateFlameEffect);
        break;
      // Add more cases for other power-up types if needed
    }
  };

  gameLoop = () => {
    renderBoard()
    requestAnimationFrame(this.gameLoop)
  }

  handlePlayerMovement = (key) => {
    const currentX = this.playerPosition.x
    const currentY = this.playerPosition.y
    let newX = currentX;
    let newY = currentY;
    if (key === 'ArrowUp' && currentY > 0) {
      newY -= 1;
    } else if (key === 'ArrowDown' && currentY < boardSize - 1) {
      newY += 1;
    } else if (key === 'ArrowLeft' && currentX > 0) {
      newX -= 1;
    } else if (key === 'ArrowRight' && currentX < boardSize - 1) {
      newX += 1;
    } else if (key === ' ') {
      // If space is pressed, set the flag to place a bomb
      this.placeBombFlag = true;
    }

    // New position move avalaibility control
    if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL
      && board[newY][newX] !== BOMB && board[newY][newX] !== PLAYER) {
      const startX = currentX;
      const startY = currentY;

      // Animation start
      this.animateStep(startX, startY, newX, newY)
      // Collect power-ups
      this.collectPowerUp();
    }
  };

  animateStep = (startX, startY, endX, endY) => {

    renderBoard();
    if (this.placeBombFlag) {
      this.placeBomb();
      this.placeBombFlag = false;
    }

    if (
      board[endY][endX] !== WALL &&
      board[endY][endX] !== BREAKABLE_WALL &&
      board[endY][endX] !== BOMB
    ) {
      this.playerPosition.x = endX;
      this.playerPosition.y = endY;

      this.updateGameState.movePlayer({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY
      })
    }
  };

  movePlayer = (startX, startY, endX, endY) => {
    if (board[startY][startX] !== BOMB) {
      board[startY][startX] = EMPTY;
    }

    board[endY][endX] = PLAYER;
  }

  placeBomb = () => {
    if (
      (!this.isBombPlaced && !this.bombCountPowerUpActive) ||
      (this.bombCountPowerUpActive && this.bombs.length < MAX_BOMBS_COUNT)
    ) {
      const currentPlayerX = this.playerPosition.x;
      const currentPlayerY = this.playerPosition.y;

      //  place bomb on the current player position
      board[currentPlayerY][currentPlayerX] = BOMB;
      this.bombs.push({ x: currentPlayerX, y: currentPlayerY });
      console.log(currentPlayerY, currentPlayerX);
      console.log(...this.bombs);
      this.isBombPlaced = true;
      // draw  new field
      renderBoard();
      // timer for bomb (3 sec)
      console.log(board[currentPlayerY][currentPlayerX]);
      setTimeout(() => {
        this.explodeBomb(currentPlayerX, currentPlayerY, this.explosionRadius);
        this.isBombPlaced = false;
      }, 3000);
    }
  };

  explodeBomb = (x, y, radius) => {
    const animateExplosion = () => {
      for (const direction of this.directions) {
        for (let i = 0; i <= radius; i++) {
          const targetX = x + direction.x * i;
          const targetY = y + direction.y * i;
          // Walls control
          if (board[targetY][targetX] === WALL) {
            break;
          }
          // Check if player is in the explosion area
          if (targetX === this.playerPosition.x && targetY === this.playerPosition.y) {
            this.playerDies(); // Вызываем функцию обработки смерти
            // return;
          }
          if (board[targetY][targetX] === BREAKABLE_WALL) {
            if (Math.random() < 0.3) {
              const powerUpType = this.getRandomPowerUpType();
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
            this.explodeBomb(targetX, targetY);
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
        setTimeout(() => {
          for (const direction of this.directions) {
            for (let i = 0; i <= radius; i++) {
              const targetX = x + direction.x * i;
              const targetY = y + direction.y * i;
              if (board[targetY][targetX] === WALL) {
                break;
              }
              board[targetY][targetX] = EMPTY;
            }
          }
          this.placePowerUp(x, y);
          renderBoard();
        }, 500); // Adjust the time as needed
      }
    };
    // bombs.splice(
    const i = this.bombs.findIndex((bomb) => bomb.x === x && bomb.y === y);
    console.log(i);
    this.bombs.splice(i, 1);
    //   1,
    // );
    console.log(this.bombs);
    let animationFrameCounter = 0;
    const maxFrames = 60;
    animateExplosion();
  };

  resetPlayerPosition = () => {
    this.playerPosition = { x: 1, y: 1 };
    board[this.playerPosition.y][this.playerPosition.x] = PLAYER;
  };

  playerDies = () => {
    this.playerLives--;

    if (this.playerLives <= 0) {
      this.lives.innerHTML = 'You die. The end of game';
    } else {
      this.resetPlayerPosition();
      renderBoard();
      this.lives.innerHTML = this.playerLives;
    }
  };
}
