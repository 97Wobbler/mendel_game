class Field {
    static gap = 10;
    static gridWidth = Card.width + Field.gap;
    static gridHeight = Card.height + Field.gap;

    static strokeColor = 0xffffff;

    constructor(rows, columns, offsetX, offsetY, scene) {
        this.rows = rows;
        this.columns = columns;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.scene = scene;

        this.grid = [];
        for (let row = 0; row < rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < columns; col++) {
                this.grid[row][col] = null;
            }
        }

        this.drawCells();
    }

    drawCells() {
        this.gridRect = [];

        for (let i = 0; i < this.rows; i++) {
            const y = this.offsetY + i * Field.gridHeight;

            this.gridRect[i] = [];
            for (let j = 0; j < this.columns; j++) {
                const x = this.offsetX + j * Field.gridWidth;

                const rect = this.scene.add.rectangle(x, y, Field.gridWidth, Field.gridHeight);
                rect.setOrigin(0, 0);
                rect.setStrokeStyle(1, Field.strokeColor);
                rect.setAlpha(0.6);

                this.gridRect[i][j] = rect;
            }
        }

        const stroke1 = this.scene.add.rectangle(this.offsetX, this.offsetY, Field.gridWidth * 7, Field.gridHeight * this.rows);
        stroke1.setOrigin(0, 0);
        stroke1.setStrokeStyle(2, Field.strokeColor);

        const stoke2 = this.scene.add.rectangle(this.offsetX + 7 * Field.gridWidth, this.offsetY, Field.gridWidth * 3, Field.gridHeight * this.rows);
        stoke2.setOrigin(0, 0);
        stoke2.setStrokeStyle(2, Field.strokeColor);
    }

    getCellFromPosition(worldX, worldY) {
        const col = Math.floor((worldX - this.offsetX) / Field.gridWidth);
        const row = Math.floor((worldY - this.offsetY) / Field.gridHeight);

        const isValidPosition = col >= 0 && col < this.columns && row >= 0 && row < this.rows;
        return isValidPosition ? { row, col } : { row: null, col: null };
    }

    placeCard(card, row, col) {
        this.grid[row][col] = card;
    }

    updateCardPosition(card, row, col) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (this.grid[r][c] === card) {
                    this.grid[r][c] = null;
                }
            }
        }
        this.placeCard(card, row, col);
    }

    getSnapPosition(row, col) {
        const x = this.offsetX + col * Field.gridWidth + Field.gap / 2;
        const y = this.offsetY + row * Field.gridHeight + Field.gap / 2;
        return { x, y };
    }

    isCellOccupied(row, col) {
        return this.grid[row][col] !== null;
    }

    isFull() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col <= 6; col++) {
                if (!this.isCellOccupied(row, col)) {
                    return false;
                }
            }
        }
        return true;
    }

    isValidOxidationValue(col, oxidationNumbersArray) {
        if (col >= 7 && col <= 9) return true;

        const oxidationStatesByColumn = {
            0: [+1], // 1족
            1: [+2], // 2족
            2: [+3], // 3족
            3: [+4, -4], // 4족
            4: [+5, -3], // 5족
            5: [+6, -2], // 6족
            6: [+7, -1], // 7족
        };

        const validOxidationNumbers = oxidationStatesByColumn[col];
        for (const oxidationNumber of validOxidationNumbers) {
            if (oxidationNumbersArray.includes(oxidationNumber)) return true;
        }

        return false;
    }

    highlightCell(row, col) {
        const cell = this.gridRect[row][col];
        if (cell) {
            cell.setStrokeStyle(5, Field.strokeColor);
            cell.setAlpha(1);
        }
    }

    clearHighlight(row, col) {
        const cell = this.gridRect[row][col];
        if (cell) {
            cell.setStrokeStyle(1, Field.strokeColor); // 원래 흰색 테두리로 복원
            cell.setAlpha(0.6);
        }
    }
}

class Phase4Field extends Field {
    constructor(offsetX, offsetY, scene) {
        super(6, 18, offsetX, offsetY, scene);
    }

    // 4단계의 필드에 맞는 특정 로직 추가
    drawCells() {
        // 기존 drawCells 메서드를 오버라이드해서 4단계의 필드에 맞게 작성
        this.gridRect = [];
        this.validCells = [];

        // 4단계 필드에 맞는 주기율표 그리기
        const periods = [
            [0, 17], // 1주기: 1족과 18족만
            [0, 1, 12, 13, 14, 15, 16, 17], // 2주기: 1~2족과 13~18족
            [0, 1, 12, 13, 14, 15, 16, 17], // 3주기: 1~2족과 13~18족
            Array.from({ length: 18 }, (_, i) => i), // 4주기: 전체 열
            Array.from({ length: 18 }, (_, i) => i), // 5주기: 전체 열
            [0, 1], // 6주기: 1~2족
        ];

        for (let row = 0; row < periods.length; row++) {
            this.gridRect[row] = [];
            for (const col of periods[row]) {
                const x = this.offsetX + col * Field.gridWidth;
                const y = this.offsetY + row * Field.gridHeight;

                const rect = this.scene.add.rectangle(x, y, Field.gridWidth, Field.gridHeight);
                rect.setOrigin(0, 0);
                rect.setStrokeStyle(1, Field.strokeColor);
                rect.setAlpha(0.6);

                this.gridRect[row][col] = rect;
                this.validCells.push([row, col]);
            }
        }

        const strokeThickness = 2;

        const stroke1 = this.scene.add.rectangle(
            this.offsetX + 0 * Field.gridWidth,
            this.offsetY + 0 * Field.gridHeight,
            1 * Field.gridWidth,
            1 * Field.gridHeight
        );
        stroke1.setOrigin(0, 0);
        stroke1.setStrokeStyle(strokeThickness, Field.strokeColor);
        stroke1.setAlpha(0.8);

        const stroke2 = this.scene.add.rectangle(
            this.offsetX + 17 * Field.gridWidth,
            this.offsetY + 0 * Field.gridHeight,
            1 * Field.gridWidth,
            1 * Field.gridHeight
        );
        stroke2.setOrigin(0, 0);
        stroke2.setStrokeStyle(strokeThickness, Field.strokeColor);
        stroke2.setAlpha(0.8);

        const stroke3 = this.scene.add.rectangle(
            this.offsetX + 0 * Field.gridWidth,
            this.offsetY + 1 * Field.gridHeight,
            2 * Field.gridWidth,
            5 * Field.gridHeight
        );
        stroke3.setOrigin(0, 0);
        stroke3.setStrokeStyle(strokeThickness, Field.strokeColor);
        stroke3.setAlpha(0.8);

        const stroke4 = this.scene.add.rectangle(
            this.offsetX + 12 * Field.gridWidth,
            this.offsetY + 1 * Field.gridHeight,
            6 * Field.gridWidth,
            4 * Field.gridHeight
        );
        stroke4.setOrigin(0, 0);
        stroke4.setStrokeStyle(strokeThickness, Field.strokeColor);
        stroke4.setAlpha(0.8);

        const stroke5 = this.scene.add.rectangle(
            this.offsetX + 2 * Field.gridWidth,
            this.offsetY + 3 * Field.gridHeight,
            10 * Field.gridWidth,
            2 * Field.gridHeight
        );
        stroke5.setOrigin(0, 0);
        stroke5.setStrokeStyle(strokeThickness, Field.strokeColor);
        stroke5.setAlpha(0.8);
    }

    isValidDropPosition(row, col) {
        return this.validCells.some(([validRow, validCol]) => row === validRow && col === validCol);
    }
}
