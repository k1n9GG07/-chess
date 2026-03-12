import Piece from './Piece.js';

export default class Queen extends Piece {
    constructor(color) {
        super(color, 'queen', color === 'white' ? '♕' : '♛');
    }

    isValidMove(startRow, startCol, targetRow, targetCol, board) {
        if (!super.isValidMove(startRow, startCol, targetRow, targetCol, board)) return false;

        const rowDiff = targetRow - startRow;
        const colDiff = targetCol - startCol;

        // Ферзь сочетает в себе ходы ладьи и слона
        const isRookMove = (rowDiff === 0 || colDiff === 0);
        const isBishopMove = (Math.abs(rowDiff) === Math.abs(colDiff));

        if (!isRookMove && !isBishopMove) return false;

        // Проверка на препятствия
        const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
        const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);

        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== targetRow || currentCol !== targetCol) {
            if (board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }
}
