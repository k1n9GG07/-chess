import Piece from './Piece.js';

export default class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn', color === 'white' ? '♙' : '♟');
    }

    isValidMove(startRow, startCol, targetRow, targetCol, board) {
        if (!super.isValidMove(startRow, startCol, targetRow, targetCol, board)) return false;

        const direction = this.color === 'white' ? -1 : 1;
        const startRowForDoubleStep = this.color === 'white' ? 6 : 1;
        
        const rowDiff = targetRow - startRow;
        const colDiff = Math.abs(targetCol - startCol);
        const targetPiece = board[targetRow][targetCol];

        // Ход вперед на 1 клетку
        if (colDiff === 0 && rowDiff === direction && !targetPiece) {
            return true;
        }

        // Ход вперед на 2 клетки (только первый ход)
        if (colDiff === 0 && rowDiff === 2 * direction && startRow === startRowForDoubleStep && !targetPiece) {
            // Проверка, что на пути нет фигур
            const middleRow = startRow + direction;
            if (!board[middleRow][startCol]) {
                return true;
            }
        }

        // Взятие фигуры по диагонали
        if (colDiff === 1 && rowDiff === direction && targetPiece && targetPiece.color !== this.color) {
            return true;
        }

        return false;
    }
}
