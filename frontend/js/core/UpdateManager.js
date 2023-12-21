import WebSocketService from '../utils/Websocket.js';

export default class UpdateManager {
    constructor(GameCore, gameUI) {
        this.gameCore = GameCore
        this.gameUI = gameUI
        this.webSocketService = new WebSocketService()
        this.webSocketService.connect()
        this.webSocketService.addMessageHandler(this.handleWebSocketMessage.bind(this));
    }

    movePlayer(data) {
        this.webSocketService.send({
            type: 'player-move',
            data: data,
        });
    }

    placeBomb(data) {
        this.webSocketService.send({
            type: 'place-bomb',
            data: data,
        });
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'update-game':
                this.gameCore.updateBoard(data.board)
                break;

            default:
                if (data.playerId == this.gameCore.playerId) {
                    switch (data.type) {
                        case 'update-flame':
                            this.gameUI.updatedFlameCount(data.payload.count)
                            break;

                        case 'update-bomb':
                            this.gameUI.updatedBombCount(data.payload.count)
                            break;

                        case 'update-speed':
                            const count = data.payload.count
                            this.gameUI.updatedSpeedLevel(count)
                            this.gameCore.updateSpeed(count)
                            break;

                        case 'update-lives':
                            const lives = data.payload.count
                            if (lives > 0) {
                                this.gameUI.updatedLives(lives)
                            } else {
                                this.gameUI.updatedLives('You die. The end of game')
                            }
                            this.gameCore.updateLives(lives)
                            break;
                    }
                }
        }
    }
}