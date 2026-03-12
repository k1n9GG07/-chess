import ChessBot from './ChessBot.js';

/**
 * Реализация случайного бота.
 * Выбирает случайный из всех доступных безопасных ходов.
 */
export default class RandomBot extends ChessBot {
    constructor(color) {
        super(color);
        this.delay = 1000; // Искусственная задержка для имитации "раздумий"
    }

    /**
     * Возвращает случайный ход.
     * @param {Board} board 
     * @param {Function} getSafeMovesFn 
     */
    async getNextMove(board, getSafeMovesFn) {
        this.log("Анализирую доступные ходы...");

        // Имитация раздумий
        await new Promise(resolve => setTimeout(resolve, this.delay));

        try {
            const allPossibleMoves = [];

            // Собираем все безопасные ходы для всех своих фигур
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board.getPiece(r, c);
                    if (piece && piece.color === this.color) {
                        const moves = getSafeMovesFn(r, c);
                        moves.forEach(move => {
                            allPossibleMoves.push({
                                start: { row: r, col: c },
                                target: move
                            });
                        });
                    }
                }
            }

            if (allPossibleMoves.length === 0) {
                this.log("Доступных ходов нет.");
                return null;
            }

            // Выбираем случайный ход
            const randomIndex = Math.floor(Math.random() * allPossibleMoves.length);
            const move = allPossibleMoves[randomIndex];

            this.log(`Выбрал ход: ${move.start.row},${move.start.col} -> ${move.target.row},${move.target.col}`);
            return move;

        } catch (error) {
            this.log(`Ошибка при поиске хода: ${error.message}`);
            return null;
        }
    }
}
