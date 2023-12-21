export const boardSize = 15; // 15x15 game board
export let board = []; // 2D array to represent the game board
const maxCord = boardSize - 2
export const PLAYER_POSITIONS = { // starting player psotitions
    1: { x: 1, y: 1 },
    2: { x: maxCord, y: 1 },
    3: { x: 1, y: maxCord },
    4: { x: maxCord, y: maxCord },
}

// Constants for cell types
export const EMPTY = 0;
export const WALL = 1;
export const PLAYER = 2;
export const BOMB = 3;
export const EXPLOSION = 4;
export const BREAKABLE_WALL = 5;
export const POWER_UP_BOMB = 6
export const POWER_UP_SPEED = 7
export const POWER_UP_FLAME = 8
export const EXPLOSION_BREAKABLE_WALL = 9

export const DEFAULT_EXPLOSION_RADIUS = 1
export const DEFAULT_PLAYER_SPEED = 1
export const DEFAULT_BOMB_COUNT = 1
export const MAX_BOMBS_COUNT = 3
export const MAX_PLAYER_SPEED = 3
export const POWER_UP_DURATION = 30 * 1000
export const PLAYER_LIVES = 3
export const BOMB_EXPLOSION_DELAY = 3 * 1000
