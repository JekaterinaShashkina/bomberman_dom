import GameUI from "../core/gameUI.js"

export default class GameView {
    constructor() {
        this.game = document.getElementById("game")
        this.gameUI = null
    }

    show(startBoard) {
        this.game.style.display = "block"
        this.gameUI = new GameUI(startBoard)
    }

    hide() {
        this.game.style.display = "none"
    }
}