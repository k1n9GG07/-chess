/**
 * Принцип SOLID: Interface Segregation & Dependency Inversion.
 * Базовый класс для всех шахматных ботов.
 */
export default class ChessBot {
    constructor(color) {
        this.color = color;
    }

    /**
     * Основной метод для получения следующего хода.
     * @param {Board} board - Текущее состояние доски.
     * @param {Function} getSafeMovesFn - Функция для получения безопасных ходов (из Game).
     * @returns {Promise<Object|null>} - Объект хода {start, target} или null.
     */
    async getNextMove(board, getSafeMovesFn) {
        throw new Error("Метод getNextMove должен быть реализован в подклассе");
    }

    /**
     * Логирование действий бота.
     */
    log(message) {
        console.log(`[Bot ${this.color}]: ${message}`);
    }
}
