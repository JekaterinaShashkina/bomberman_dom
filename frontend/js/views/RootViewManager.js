import GameView from "./GameView.js";
import LobbyView from "./LobbyView.js";

export default class RootViewManager {
    constructor() {
        this.lobbyView = new LobbyView(this)
        this.gameView = new GameView()
    }

    getGameView(startBoard) {
        this.lobbyView.hide()
        this.gameView.show(startBoard)
    }
}