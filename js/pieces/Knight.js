import Piece from './Piece.js';

export default class Knight extends Piece {
    constructor(color) {
        super(color, 'knight', color === 'white' ? '♘' : '♞');
    }

    isValidMove(startRow, startCol, targetRow, targetCol, board) {
        if (!super.isValidMove(startRow, startCol, targetRow, targetCol, board)) return false;

        const rowDiff = Math.abs(targetRow - startRow);
        const colDiff = Math.abs(targetCol - startCol);

        // Конь ходит буквой Г: 2 клетки в одну сторону и 1 в другую
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
}
