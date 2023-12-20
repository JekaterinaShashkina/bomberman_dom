import { timer } from '../utils/timer.js';
import WebSocketService from '../utils/Websocket.js';
import frame from '../../framework/framework.js'

export default class LobbyView {
    constructor(RootViewManager) {
        this.RootViewManager = RootViewManager
        this.nickname = ""
        this.gameSetup = {}

        this.webSocketService = new WebSocketService()
        this.webSocketService.connect();

        this.lobby = document.getElementById("lobby-container")
        const elements = this.createLobbyElemenets(this.lobby)
        this.joinButton = elements.joinButton
        this.nicknameInput = elements.nicknameInput
        this.playerCounter = elements.playerCounter
        this.countdownElement = elements.countdownElement
        this.elem =  elements.elem

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
        this.joinButton.click(() => {
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

    createLobbyElemenets(container) {
        const joinButton = frame.createButton({
            id: "join-button"
        }, "Join Game")

        const nicknameInput = frame.createInput({
            type: "text",
            id: "nickname-input",
            placeholder: "Nickname",
        })

        const playerCounter = frame.createDiv({
            id: "player-counter"
        },
            "Current Players: ",
            frame.createSpan({
                id: "player-count"
            }, "0/4"),
        )

        const countdownElement = frame.createDiv({
            id: "countdown"
        },
            frame.createSpan({
                class: "count__sec"
            },
                " seconds"
            )
        )

        const elem = frame.createSpan({
            class: "wait__players"
        })

        container.append(
            frame.createH1({}, "Welcome to Bomberman-DOM"),
            frame.createSection({
                id: "nickname-section"
            },
                frame.createLabel({
                    for: "nickname-input"
                }, "Enter your nickname:"),
                nicknameInput,
                joinButton,
            ),
            frame.createSection({
                id: "waiting-section"
            },
                frame.createP({},
                    "Waiting for players... ",
                    elem,
                ),
                playerCounter,
                frame.createDiv({
                    id: "timer"
                },
                    "Game starts in:",
                    countdownElement,
                )
            )
        )

        return {
            joinButton: joinButton,
            nicknameInput: nicknameInput,
            playerCounter: playerCounter,
            countdownElement: countdownElement,
            elem: elem}
    }
}