import {
    POWER_UP_BOMB,
    POWER_UP_SPEED,
    POWER_UP_FLAME,
    DEFAULT_EXPLOSION_RADIUS,
    DEFAULT_PLAYER_SPEED,
    DEFAULT_BOMB_COUNT,
    MAX_BOMBS_COUNT,
    POWER_UP_DURATION,
    PLAYER_LIVES,
    MAX_PLAYER_SPEED,
} from '../../../frontend/const.js'

export default class Player {
    flameUpdate = 'update-flame'
    bombUpdate = 'update-bomb'
    speedUpdate = 'update-speed'
    updateLives = 'update-lives'

    constructor(id, startPosition, nickname, wss) {
        this.id = id
        this.playerPosition = Object.assign({}, startPosition);
        this.startPosition = startPosition
        this.nickname = nickname
        this.wss = wss

        this.delayPlayerDeath = false
        this.bombsPlaced = 0
        this.playerLives = PLAYER_LIVES;
        this.playerSpeed = DEFAULT_PLAYER_SPEED
        this.explosionRadius = DEFAULT_EXPLOSION_RADIUS
        this.currentMaxBombs = DEFAULT_BOMB_COUNT
    }

    getPosition = () => {
        return [this.playerPosition.x, this.playerPosition.y]
    }

    applyPowerUpEffect = (powerUpType) => {
        switch (powerUpType) {
            case POWER_UP_BOMB:
                if (this.currentMaxBombs < MAX_BOMBS_COUNT) {
                    this.currentMaxBombs++;
                    this.sendUpdateToPlayer(this.bombUpdate, { count: this.currentMaxBombs })
                    setTimeout(() => {
                        this.currentMaxBombs--
                        this.sendUpdateToPlayer(this.bombUpdate, { count: this.currentMaxBombs })
                    }, POWER_UP_DURATION)
                }
                break;
            case POWER_UP_SPEED:
                if (this.playerSpeed < MAX_PLAYER_SPEED) {
                    this.playerSpeed++;
                    this.sendUpdateToPlayer(this.speedUpdate, { count: this.playerSpeed })
                    setTimeout(() => {
                        this.playerSpeed--
                        this.sendUpdateToPlayer(this.speedUpdate, { count: this.playerSpeed })
                    }, POWER_UP_DURATION)
                }
                break;
            case POWER_UP_FLAME:
                this.explosionRadius++;
                this.sendUpdateToPlayer(this.flameUpdate, { count: this.explosionRadius })
                setTimeout(() => {
                    this.explosionRadius--
                    this.sendUpdateToPlayer(this.flameUpdate, { count: this.explosionRadius })
                }, POWER_UP_DURATION)
                break;
        }
    };

    sendUpdateToPlayer = (type, payload) => {
        this.wss.broadcast({
            type: type,
            payload: payload,
            playerId: this.id
        })
    }

    playerLosesLife() {
        this.playerLives--
        this.delayPlayerDeath = true
        setTimeout(() => {
            this.delayPlayerDeath = false
        }, 1000)
        this.wss.broadcast({
            type: this.updateLives,
            payload: { count: this.playerLives },
            playerId: this.id
        })
    }
}