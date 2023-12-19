export const boardSize = 15; // 15x15 game board
export let board = []; // 2D array to represent the game board

// Constants for cell types
export const EMPTY = 0;
export const WALL = 1;
export const PLAYER = 2;
export const BOMB = 3;
export const EXPLOSION = 4;
export const BREAKABLE_WALL = 5;
export const POWER_UP_BOMB_COUNT = 6
export const POWER_UP_SPEED_COUNT = 7
export const POWER_UP_FLAME_COUNT = 8
export const DEFAULT_EXPLOSION_RADIUS = 1
export const DEFAULT_PLAYER_SPEED = 1
export const MAX_BOMBS_COUNT = 3
export const POWER_UP_DURATION = 30 * 1000
