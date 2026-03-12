/**
 * Принцип SOLID: Single Responsibility Principle (Принцип единой ответственности)
 * Базовый класс Piece отвечает только за общие свойства и методы шахматной фигуры.
 */
export default class Piece {
    /**
     * @param {string} color - 'white' или 'black'
     * @param {string} type - 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
     * @param {string} symbol - Юникод символ фигуры
     */
    constructor(color, type, symbol) {
        this.color = color;
        this.type = type;
        this.symbol = symbol;
        this.hasMoved = false; // Полезно для рокировки и первого хода пешки
    }

    /**
     * Принцип SOLID: Open/Closed Principle (Принцип открытости/закрытости)
     * Каждая фигура переопределяет этот метод, добавляя свою логику перемещения,
     * не изменяя основной код доски или игры.
     * 
     * @param {number} startRow 
     * @param {number} startCol 
     * @param {number} targetRow 
     * @param {number} targetCol 
     * @param {Array} board - Текущее состояние доски
     * @returns {boolean}
     */
    isValidMove(startRow, startCol, targetRow, targetCol, board) {
        // Базовая проверка: нельзя ходить на клетку со своей фигурой
        const targetPiece = board[targetRow][targetCol];
        if (targetPiece && targetPiece.color === this.color) {
            return false;
        }
        return true;
    }

    /**
     * Получение всех возможных ходов для фигуры.
     * @returns {Array} - Массив объектов {row, col}
     */
    getPossibleMoves(row, col, board) {
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(row, col, r, c, board)) {
                    moves.push({ row: r, col: c });
                }
            }
        }
        return moves;
    }
}
