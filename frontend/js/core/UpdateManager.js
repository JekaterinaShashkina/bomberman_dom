import WebSocketService from '../utils/websocket.js';

export default class UpdateManager {
    constructor(GameCore) {
        this.gameCore = GameCore
        this.webSocketService = new WebSocketService()
        this.webSocketService.connect()
        this.webSocketService.addMessageHandler(this.handleWebSocketMessage.bind(this));

        this.livesCount = document.getElementById('lives-count');
        this.bombCount = document.getElementById('bomb-count');
        this.flameCount = document.getElementById('flame-count');
        this.speedLevel = document.getElementById('speed-level');
    }

    movePlayer(data) {
        this.webSocketService.send({
            type: 'player-move',
            coordinates: data,
        });
    }

    handleWebSocketMessage(data) {
        console.log('Received WS message:', data);
        switch (data.type) {
            case 'update-lives':
                this.livesCount.innerText = data.lives;
                break;
            case 'update-bomb':
                this.bombCount.innerText = data.bombs;
                break;
            case 'update-flame':
                this.flameCount.innerText = data.flames;
                break;
            case 'update-speed':
                this.speedLevel.innerText = data.speed;
                break;
            case 'player-move':
                const coordinates = data.coordinates
                this.gameCore.movePlayer(
                    coordinates.startX,
                    coordinates.startY,
                    coordinates.newX,
                    coordinates.newY)
                break;
            case 'place-bomb':
                placeBombOnMap(data.position);
                break;
            // ... Additional game-related updates
        }
    }
}