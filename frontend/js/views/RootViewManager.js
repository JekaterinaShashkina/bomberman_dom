import Chat from "../chat/Chat.js";
import GameView from "./GameView.js";
import LobbyView from "./LobbyView.js";

export default class RootViewManager {
    constructor() {
        this.lobbyView = new LobbyView(this)
        this.gameView = new GameView()
    }

    getGameView(gameSetup) {
        this.lobbyView.hide()
        this.gameView.show(gameSetup)
    }

    showChat(nickname) {
        this.chat = new Chat(nickname)
        this.chat.show()
    }
}