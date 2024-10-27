class GameManager {
    constructor() {
        this.currentPhase = 1; // 현재 게임이 진행 중인 단계 (1~4)
        this.score = 0; // 총 점수
        this.gameTime = 0; // 경과 시간 (초 단위)
        this.maxPhase = 4; // 총 단계 수 (4단계)
        this.cardPlacements = [];
    }

    saveCardPlacement(card, row, col) {
        if (!this.cardPlacements[row]) {
            this.cardPlacements[row] = [];
        }
        this.cardPlacements[row].push({ row, col, elementNumber: card.elementInfo?.number, cardType: card.cardType });
    }

    saveFieldState(field) {
        for (let row = 0; row < field.rows; row++) {
            for (let col = 0; col < field.columns; col++) {
                const card = field.grid[row][col];
                if (card) {
                    this.saveCardPlacement(card, row, col); // 각 카드를 저장
                }
            }
        }
    }

    getRowCards(row) {
        return this.cardPlacements[row] || [];
    }

    // Phase 1~3 시작 시 호출
    startGame() {
        this.currentPhase = 1;
        this.score = 0; // 점수 초기화
        this.gameTime = 0; // 시간 초기화

        game.scale.resize(window.innerWidth - 10, window.innerHeight - 10);
    }

    // 현재 Phase가 완료되었을 때 호출
    completeCurrentPhase(scene) {
        if (this.currentPhase === 3) {
            this.endGame();
            return;
        }

        uiManager.showPopup(`Stage ${this.currentPhase} Complete`, "Well done! Get ready for the next stage.", () => {
            this.currentPhase++;

            switch (this.currentPhase) {
                case 2: {
                    scene.createPhase2Cards();
                    break;
                }
                case 3: {
                    scene.createPhase3Cards();
                    break;
                }
            }
        });
    }

    updateScore(points) {
        this.score += points;
    }

    endGame() {
        document.dispatchEvent(new Event("gameEnded"));
        uiManager.showEndScreen(this.score);
    }
}

const gameManager = new GameManager();
