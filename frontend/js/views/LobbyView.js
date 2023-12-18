import { timer } from '../utils/timer.js';
import WebSocketService from '../utils/websocket.js';

export default class LobbyView {
    constructor(RootViewManager) {
        this.RootViewManager = RootViewManager
        this.nickname = ""

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

    getGameView(gameSetup) {
        this.RootViewManager.getGameView(gameSetup)
    }

    setJoinButtonListener() {
        this.joinButton.addEventListener('click', () => {
            const playerCounter = this.playerCounter
            if (playerCounter >= 2 && playerCounter < 4) {
                timer(this.elem);
            }
            const nickname = this.nicknameInput.value.trim();
            this.nickname = nickname
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

            this.gameSetup = {}
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
                    console.log(this)
                    console.log(this.nickname)
                    this.RootViewManager.showChat(this.nickname)
                    this.gameSetup.startPosition = data.startPosition
                    break;

                case 'join-error':
                    this.joinButton.disabled = false;
                    this.joinButton.innerText = 'Join Game';
                    alert(data.message || 'Error joining game');
                    break;

                case 'game-start':
                    this.gameSetup.startBoard = data.map;
                    this.getGameView(this.gameSetup)
                    break;
            }
        });
    }
}