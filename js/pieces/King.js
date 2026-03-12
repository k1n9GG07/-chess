import Piece from './Piece.js';

export default class King extends Piece {
    constructor(color) {
        super(color, 'king', color === 'white' ? '♔' : '♚');
    }

    isValidMove(startRow, startCol, targetRow, targetCol, board) {
        if (!super.isValidMove(startRow, startCol, targetRow, targetCol, board)) return false;

        const rowDiff = Math.abs(targetRow - startRow);
        const colDiff = Math.abs(targetCol - startCol);

        // Король ходит на 1 клетку в любую сторону
        return rowDiff <= 1 && colDiff <= 1;
    }
}
