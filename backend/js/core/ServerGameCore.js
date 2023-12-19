import {
    board,
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

    constructor(map, wss) {
        this.setBoard(map)
        this.wss = wss
    }

    handleMessage(clientData) {
        switch (clientData.type) {
            case 'player-move':
                const coordinates = clientData.coordinates
                this.movePlayer(
                    coordinates.startX,
                    coordinates.startY,
                    coordinates.newX,
                    coordinates.newY)
                break;
            case 'place-bomb':
                const bomb = clientData.bomb
                this.placeBomb(bomb)
                break;
            case 'player-dies':
                const location = clientData.coordinates
                this.playerDies(
                    location.x,
                    location.y)
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

    movePlayer = (startX, startY, endX, endY) => {
        // New position move avalaibility control
        if (board[endY][endX] !== WALL && board[endY][endX] !== BREAKABLE_WALL
            && board[endY][endX] !== BOMB && board[endY][endX] !== PLAYER) {
            if (board[startY][startX] !== BOMB &&
                board[startY][startX] !== EXPLOSION) {
                board[startY][startX] = EMPTY;
            }

            board[endY][endX] = PLAYER;
        }
    }

    playerDies = (currentX, currentY) => {
        if (board[currentY][currentX] === EXPLOSION) {
            board[currentY][currentX] = EXPLOSION;
        } else {
            board[currentY][currentX] = EMPTY;
        }
        this.updateBoard()
    }

    placeBomb = (bomb) => {
        board[bomb.y][bomb.x] = BOMB;
        setTimeout(() => {
            this.explodeBomb(bomb);
        }, BOMB_EXPLOSION_DELAY);
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
                if (board[targetY][targetX] === BREAKABLE_WALL) {
                    board[targetY][targetX] = EXPLOSION_BREAKABLE_WALL;
                } else {
                    board[targetY][targetX] = EXPLOSION;
                }
            }
        }
        // Send game update
        this.updateBoard()

        // Call animateExplosion again until the end of animation time
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
                    } else {
                        board[targetY][targetX] = EMPTY
                    }
                }
            }
            this.updateBoard()
        }, 1000); // Adjust the time as needed
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