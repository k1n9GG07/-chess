import Game from './Game.js';

/**
 * Главный файл входа в приложение.
 * Принцип SOLID: Single Responsibility - Инициализация приложения.
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        const chessGame = new Game();
        console.log('Шахматная игра успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при запуске игры:', error);
    }
});
