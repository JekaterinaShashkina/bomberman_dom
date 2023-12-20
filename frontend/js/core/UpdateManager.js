import WebSocketService from '../utils/Websocket.js';

export default class UpdateManager {
    constructor(GameCore) {
        this.gameCore = GameCore
        this.webSocketService = new WebSocketService()
        this.webSocketService.connect()
        this.webSocketService.addMessageHandler(this.handleWebSocketMessage.bind(this));
    }

    movePlayer(coordinates) {
        this.webSocketService.send({
            type: 'player-move',
            coordinates: coordinates,
        });
    }

    placeBomb(bomb) {
        this.webSocketService.send({
            type: 'place-bomb',
            bomb: bomb,
        });
    }

    playerDies(coordinates) {
        this.webSocketService.send({
            type: 'player-dies',
            coordinates: coordinates,
        });
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'update-game':
                this.gameCore.updateBoard(data.board)
        }
    }
}