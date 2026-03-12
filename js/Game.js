import Board from './Board.js';
import RandomBot from './bots/RandomBot.js';

/**
 * Принцип SOLID: Single Responsibility Principle
 * Класс Game отвечает за игровой процесс, управление ходами и пользовательским интерфейсом.
 */
export default class Game {
    constructor() {
        this.board = new Board();
        this.currentPlayer = 'white';
        this.selectedCell = null;
        this.possibleMoves = [];
        this.moveHistory = [];
        this.gameMode = 'pve'; // 'pvp' или 'pve'
        this.bot = new RandomBot('black');
        this.isBotThinking = false;
        this.initUI();
    }

    /**
     * Инициализация элементов управления и обработчиков событий
     */
    initUI() {
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('current-player');
        this.historyElement = document.getElementById('move-history');
        this.resetButton = document.getElementById('reset-button');
        this.modeSelect = document.getElementById('game-mode');

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.modeSelect.addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.resetGame();
        });
        
        this.renderBoard();
        this.updateHistoryUI();
        
        // Запускаем бота, если сейчас его ход
        if (this.gameMode === 'pve' && this.currentPlayer === this.bot.color) {
            this.makeBotMove();
        }
    }

    /**
     * Отрисовка шахматной доски в DOM
     */
    renderBoard() {
        this.boardElement.innerHTML = '';
        
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                const isWhite = (r + c) % 2 === 0;
                
                cell.className = `chess-board__cell ${isWhite ? 'chess-board__cell--white' : 'chess-board__cell--black'}`;
                cell.dataset.row = r;
                cell.dataset.col = c;

                // Подсветка выбранной клетки и возможных ходов
                if (this.selectedCell && this.selectedCell.row === r && this.selectedCell.col === c) {
                    cell.classList.add('chess-board__cell--selected');
                }

                const move = this.possibleMoves.find(m => m.row === r && m.col === c);
                if (move) {
                    if (this.board.getPiece(r, c)) {
                        cell.classList.add('chess-board__cell--capture');
                    } else {
                        cell.classList.add('chess-board__cell--possible-move');
                    }
                }

                const piece = this.board.getPiece(r, c);
                if (piece) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = 'chess-board__piece';
                    pieceEl.textContent = piece.symbol;
                    cell.appendChild(pieceEl);
                }

                cell.addEventListener('click', () => this.handleCellClick(r, c));
                this.boardElement.appendChild(cell);
            }
        }

        this.updateStatus();
    }

    /**
     * Обработка клика по клетке
     */
    handleCellClick(row, col) {
        if (this.isBotThinking) return; // Запрещаем ходить, пока бот думает

        const piece = this.board.getPiece(row, col);

        // Если уже выбрана клетка и кликнули на возможный ход
        if (this.selectedCell) {
            const move = this.possibleMoves.find(m => m.row === row && m.col === col);
            if (move) {
                this.executeMove(this.selectedCell.row, this.selectedCell.col, row, col);
                return;
            }
        }

        // Выбор своей фигуры
        if (piece && piece.color === this.currentPlayer) {
            this.selectedCell = { row, col };
            this.possibleMoves = this.getSafeMoves(row, col);
        } else {
            this.selectedCell = null;
            this.possibleMoves = [];
        }

        this.renderBoard();
    }

    /**
     * Получение "безопасных" ходов (которые не подставляют короля под шах)
     */
    getSafeMoves(row, col) {
        const piece = this.board.getPiece(row, col);
        if (!piece) return [];

        const allMoves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (piece.isValidMove(row, col, r, c, this.board.grid)) {
                    // Принцип SOLID: Dependency Inversion - проверяем ход, временно его выполняя
                    if (this.isMoveSafe(row, col, r, c)) {
                        allMoves.push({ row: r, col: c });
                    }
                }
            }
        }
        return allMoves;
    }

    /**
     * Проверка, не поставит ли ход короля под шах
     */
    isMoveSafe(startRow, startCol, targetRow, targetCol) {
        const piece = this.board.grid[startRow][startCol];
        const targetPiece = this.board.grid[targetRow][targetCol];
        
        // Временный ход
        this.board.grid[targetRow][targetCol] = piece;
        this.board.grid[startRow][startCol] = null;
        
        const inCheck = this.board.isKingInCheck(this.currentPlayer);
        
        // Откат хода
        this.board.grid[startRow][startCol] = piece;
        this.board.grid[targetRow][targetCol] = targetPiece;
        
        return !inCheck;
    }

    /**
     * Выполнение хода
     */
    async executeMove(startRow, startCol, targetRow, targetCol) {
        const piece = this.board.getPiece(startRow, startCol);
        const capturedPiece = this.board.movePiece(startRow, startCol, targetRow, targetCol);
        
        this.logMove(piece, startRow, startCol, targetRow, targetCol, capturedPiece);
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.selectedCell = null;
        this.possibleMoves = [];
        
        this.renderBoard();

        if (this.isGameOver()) {
            const isCheck = this.board.isKingInCheck(this.currentPlayer);
            if (isCheck) {
                alert(`Мат! Победили ${this.currentPlayer === 'white' ? 'Черные' : 'Белые'}`);
            } else {
                alert(`Пат! Ничья.`);
            }
            this.resetGame();
            return;
        } else if (this.board.isKingInCheck(this.currentPlayer)) {
            // alert(`Шах ${this.currentPlayer === 'white' ? 'Белым' : 'Черным'}!`);
            // Убрали alert, чтобы не мешать боту
        }

        // Если сейчас ход бота
        if (this.gameMode === 'pve' && this.currentPlayer === this.bot.color) {
            this.makeBotMove();
        }
    }

    /**
     * Логика хода бота
     */
    async makeBotMove() {
        this.isBotThinking = true;
        this.updateStatus();

        try {
            const move = await this.bot.getNextMove(this.board, this.getSafeMoves.bind(this));
            if (move) {
                await this.executeMove(move.start.row, move.start.col, move.target.row, move.target.col);
            }
        } catch (error) {
            console.error("Ошибка при ходе бота:", error);
        } finally {
            this.isBotThinking = false;
            this.updateStatus();
        }
    }

    /**
     * Проверка на мат (нет доступных ходов)
     */
    isGameOver() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board.getPiece(r, c);
                if (piece && piece.color === this.currentPlayer) {
                    const moves = this.getSafeMoves(r, c);
                    if (moves.length > 0) return false;
                }
            }
        }
        return true;
    }

    /**
     * Обновление статуса игры
     */
    updateStatus() {
        if (this.isBotThinking) {
            this.statusElement.textContent = "Бот думает...";
            this.statusElement.style.color = "#f39c12";
            return;
        }
        this.statusElement.textContent = this.currentPlayer === 'white' ? 'Белые' : 'Черные';
        this.statusElement.style.color = this.currentPlayer === 'white' ? '#2c3e50' : '#e74c3c';
    }

    /**
     * Запись хода в историю
     */
    logMove(piece, startRow, startCol, targetRow, targetCol, captured) {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const start = `${letters[startCol]}${8 - startRow}`;
        const target = `${letters[targetCol]}${8 - targetRow}`;
        const moveStr = `${piece.symbol} ${start} → ${target} ${captured ? '(взятие ' + captured.symbol + ')' : ''}`;
        
        this.moveHistory.unshift(moveStr);
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        this.historyElement.innerHTML = this.moveHistory
            .map(move => `<li class="game__log-item">${move}</li>`)
            .join('');
    }

    resetGame() {
        this.board = new Board();
        this.currentPlayer = 'white';
        this.selectedCell = null;
        this.possibleMoves = [];
        this.moveHistory = [];
        this.isBotThinking = false;
        this.renderBoard();
        this.updateHistoryUI();
        
        // Если бот играет за белых (на будущее) или если нужно запустить бота сразу
        if (this.gameMode === 'pve' && this.currentPlayer === this.bot.color) {
            this.makeBotMove();
        }
    }
}
