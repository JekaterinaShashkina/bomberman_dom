import {
    board,
    boardSize,
    WALL,
    EMPTY,
    BOMB,
    BREAKABLE_WALL,
    PLAYER,
    EXPLOSION,
    EXPLOSION_BREAKABLE_WALL,
    POWER_UP_BOMB,
    POWER_UP_SPEED,
    POWER_UP_FLAME,
    BOMB_EXPLOSION_DELAY,
} from '../../../frontend/const.js'
import { initializeBoard } from '../map/map.js';
import Bomb from './Bomb.js';

export default class ServerGameCore {
    directions = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 },
    ];

    powerUpsTypes = [
        POWER_UP_BOMB,
        POWER_UP_SPEED,
        POWER_UP_FLAME,
    ];

    players = {}

    constructor(wss) {
        this.wss = wss
    }

    startGame() {
        const map = initializeBoard(this.players);
        this.setBoard(map)
        this.wss.broadcast({ type: 'game-start', map: map });
    }

    handleMessage(clientData) {
        switch (clientData.type) {
            case 'player-move':
                this.handlePlayerMovement(clientData.data)
                break;

            case 'place-bomb':
                this.placeBomb(clientData.data)
                break;
        }

        this.updateBoard()
    }

    updateBoard = () => {
        this.wss.broadcast({
            type: 'update-game',
            board: board,
        });
    }

    addPlayer = (id, player) => {
        this.players[id] = player
    }

    handlePlayerMovement = (data) => {
        const player = this.players[data.playerId]
        const direction = data.direction
        const [startX, startY] = player.getPosition()
        let newX = startX;
        let newY = startY;

        if (direction === 'ArrowUp' && startY > 1) {
            newY -= 1;
        } else if (direction === 'ArrowDown' && startY < boardSize - 1) {
            newY += 1;
        } else if (direction === 'ArrowLeft' && startX > 1) {
            newX -= 1;
        } else if (direction === 'ArrowRight' && startX < boardSize - 1) {
            newX += 1;
        }

        if (board[newY][newX] === EXPLOSION) {
            this.playerDies(player)
        } else if (board[newY][newX] !== WALL && board[newY][newX] !== BREAKABLE_WALL
            && board[newY][newX] !== BOMB && board[newY][newX] !== PLAYER) {
            this.collectPowerUp(newX, newY, player)
            this.movePlayer(player, newX, newY)
        }
    }

    movePlayer = (player, endX, endY) => {
        const [startX, startY] = player.getPosition()
        player.playerPosition.x = endX
        player.playerPosition.y = endY

        if (board[startY][startX] !== BOMB && board[startY][startX] !== EXPLOSION) {
            board[startY][startX] = EMPTY;
        }

        board[endY][endX] = PLAYER;
        this.updateBoard()
    }

    collectPowerUp = (newX, newY, player) => {
        if (this.powerUpsTypes.includes(board[newY][newX])) {
            player.applyPowerUpEffect(board[newY][newX])
        }
    };

    placeBomb = (data) => {
        const player = this.players[data.playerId]

        if (player.bombsPlaced < player.currentMaxBombs) {
            const [x, y] = player.getPosition()
            const bomb = new Bomb(x, y, player.explosionRadius)
            board[y][x] = BOMB;

            player.bombsPlaced++;
            setTimeout(() => {
                player.bombsPlaced--
                this.explodeBomb(bomb);
            }, BOMB_EXPLOSION_DELAY);
        }
    }

    explodeBomb = (bomb) => {
        const x = bomb.x
        const y = bomb.y
        const radius = bomb.radius

        for (const direction of this.directions) {
            for (let i = 0; i <= radius; i++) {
                const targetX = x + direction.x * i;
                const targetY = y + direction.y * i;
                // Walls control
                if (board[targetY][targetX] === WALL) {
                    break;
                }
                const player = this.findPlayer(targetX, targetY)
                if (player) this.playerDies(player)
                if (board[targetY][targetX] === BREAKABLE_WALL) {
                    board[targetY][targetX] = EXPLOSION_BREAKABLE_WALL;
                } else {
                    board[targetY][targetX] = EXPLOSION;
                }
            }
        }
        // Send game update
        this.updateBoard()

        setTimeout(() => {
            for (const direction of this.directions) {
                for (let i = 0; i <= radius; i++) {
                    const targetX = x + direction.x * i;
                    const targetY = y + direction.y * i;
                    if (board[targetY][targetX] === WALL) {
                        break;
                    }

                    if (board[targetY][targetX] === EXPLOSION_BREAKABLE_WALL && Math.random() < 1) {
                        board[targetY][targetX] = this.getRandomPowerUpType();
                    } else if (this.findPlayer(targetX, targetY)?.playerLives > 0) {
                        board[targetY][targetX] = PLAYER
                    } else {
                        board[targetY][targetX] = EMPTY
                    }
                }
            }
            this.updateBoard()
        }, 1000); // Adjust the time as needed
    };

    findPlayer(x, y) {
        for (const player of Object.values(this.players)) {
            const [currentX, currentY] = player.getPosition()
            if (currentX === x && currentY === y) {
                return player
            }
        }
        return null
    }

    playerDies = (player) => {
        if (!player.delayPlayerDeath) {
            player.playerLosesLife()

            if (player.playerLives <= 0) {
                const [x, y] = player.getPosition()
                if (board[y][x] === PLAYER) {
                    board[y][x] = EMPTY
                }
            } else {
                this.movePlayer(player, player.startPosition.x, player.startPosition.y)
            }
        }
    };

    getRandomPowerUpType = () => {
        const selectedPowerUp =
            this.powerUpsTypes[Math.floor(Math.random() * this.powerUpsTypes.length)];
        return selectedPowerUp;
    };

    setBoard = (startBoard) => {
        startBoard.forEach(row => board.push(row))
    }
}