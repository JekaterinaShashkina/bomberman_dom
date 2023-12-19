import {
    WALL,
    EMPTY,
    BREAKABLE_WALL,
    PLAYER,
    boardSize,
} from '../../../frontend/js/core/const.js';
import { PLAYER_POSITIONS } from '../core/const.js';

const board = [];

export const initializeBoard = (playerCount) => {
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            // Add walls on the borders and at even cells
            if (
                i === 0 ||
                i === boardSize - 1 ||
                j === 0 ||
                j === boardSize - 1 ||
                (i % 2 === 0 && j % 2 === 0)
                // Math.random() < 0.2
            ) {
                row.push(WALL);
            } else if (
                i % 2 === 1 &&
                j % 2 === 1 &&
                !(i === 1 && j === 1) &&
                Math.random() < 0.4
            ) {
                row.push(BREAKABLE_WALL);
            } else {
                row.push(EMPTY);
            }
        }
        board.push(row);
    }

    // Set player positions
    for (const [key, value] of Object.entries(PLAYER_POSITIONS)) {
        if (key <= playerCount) {
            board[value.y][value.x] = PLAYER;
        }
    }
    
    return board;
};