import Pawn from './pieces/Pawn.js';
import Rook from './pieces/Rook.js';
import Knight from './pieces/Knight.js';
import Bishop from './pieces/Bishop.js';
import Queen from './pieces/Queen.js';
import King from './pieces/King.js';

/**
 * Принцип SOLID: Single Responsibility Principle
 * Класс Board отвечает только за управление состоянием игрового поля и его инициализацию.
 */
export default class Board {
    constructor() {
        this.grid = Array(8).fill(null).map(() => Array(8).fill(null));
        this.initBoard();
    }

    /**
     * Инициализация начальной расстановки фигур
     */
    initBoard() {
        // Расстановка пешек
        for (let i = 0; i < 8; i++) {
            this.grid[1][i] = new Pawn('black');
            this.grid[6][i] = new Pawn('white');
        }

        // Расстановка остальных фигур
        const setup = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        
        for (let i = 0; i < 8; i++) {
            this.grid[0][i] = new setup[i]('black');
            this.grid[7][i] = new setup[i]('white');
        }
    }

    /**
     * Перемещение фигуры
     */
    movePiece(startRow, startCol, targetRow, targetCol) {
        const piece = this.grid[startRow][startCol];
        if (!piece) return false;

        const targetPiece = this.grid[targetRow][targetCol];
        this.grid[targetRow][targetCol] = piece;
        this.grid[startRow][startCol] = null;
        piece.hasMoved = true;

        return targetPiece; // Возвращаем взятую фигуру, если она была
    }

    /**
     * Получение фигуры в конкретной позиции
     */
    getPiece(row, col) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) return null;
        return this.grid[row][col];
    }

    /**
     * Проверка, находится ли король под шахом
     */
    isKingInCheck(color) {
        let kingPos = null;
        
        // Находим короля
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.grid[r][c];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPos = { r, c };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        // Проверяем, может ли какая-то фигура противника побить короля
        const enemyColor = color === 'white' ? 'black' : 'white';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.grid[r][c];
                if (piece && piece.color === enemyColor) {
                    if (piece.isValidMove(r, c, kingPos.r, kingPos.c, this.grid)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
