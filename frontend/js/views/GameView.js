import GameUI from "../core/GameUI.js"

export default class GameView {
    constructor() {
        this.game = document.getElementById("game-container")
        this.gameUI = null
    }

    show(gameSetup) {
        this.game.style.display = "block"
        this.gameUI = new GameUI(gameSetup)
    }

    hide() {
        this.game.style.display = "none"
    }
}
