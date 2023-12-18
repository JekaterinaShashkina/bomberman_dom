import { timer } from '../utils/timer.js';
import WebSocketService from '../utils/websocket.js';
import { playerPosition } from '../core/game.js';

export default class LobbyView {
    constructor(RootViewManager) {
        this.RootViewManager = RootViewManager

        this.webSocketService = new WebSocketService()
        this.webSocketService.connect();

        this.lobby = document.getElementById("lobby-container")
        this.joinButton = document.getElementById('join-button');
        this.nicknameInput = document.getElementById('nickname-input');
        this.playerCounter = document.getElementById('player-count');
        this.countdownElement = document.getElementById('countdown');
        this.elem = document.querySelector('.wait__players');

        this.setJoinButtonListener()
        this.setWebsocketListener()
    }

    show() {
        this.lobby.style.display = "block"
    }

    hide() {
        this.lobby.style.display = "none"
    }

    getGameView(startBoard) {
        this.RootViewManager.getGameView(startBoard)
    }

    setJoinButtonListener() {
        this.joinButton.addEventListener('click', () => {
            const playerCounter = this.playerCounter
            if (playerCounter >= 2 && playerCounter < 4) {
                timer(this.elem);
            }
            const nickname = this.nicknameInput.value.trim();
            if (nickname.length === 0) {
                alert('Please enter a nickname!');
                return;
            }

            this.webSocketService.send({
                type: 'join-game',
                nickname: nickname,
            });

            this.joinButton.disabled = true;
            this.joinButton.innerText = 'Joining...';
        });
    }

    setWebsocketListener() {
        // Handle incoming WebSocket messages
        this.webSocketService.addMessageHandler((data) => {
            switch (data.type) {
                case 'update-player-count':
                    this.playerCounter.innerHTML = data.count;
                    break;

                case 'update-countdown':
                    this.countdownElement.innerText = `${data.time} seconds`;
                    break;

                case 'joined-successfully':
                    this.joinButton.innerText = 'Joined! Waiting...';
                    this.RootViewManager.showChat()
                    const startPosition = data.startPosition
                    playerPosition.x = startPosition.x
                    playerPosition.y = startPosition.y
                    break;

                case 'join-error':
                    this.joinButton.disabled = false;
                    this.joinButton.innerText = 'Join Game';
                    alert(data.message || 'Error joining game');
                    break;

                case 'game-start':
                    const startBoard = data.map;
                    this.getGameView(startBoard)
                    break;
            }
        });
    }
}