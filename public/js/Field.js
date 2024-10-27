class Field {
    static gap = 15;
    static gridWidth = Card.width + Field.gap;
    static gridHeight = Card.height + Field.gap;

    static rows = 8;
    static columns = 11;
    static offsetX = 50;
    static offsetY = 50;

    static strokeColor = 0xffffff;

    static highlightedCell = null;

    constructor(scene) {
        this.scene = scene;

        this.cards = [];
        for (let row = 0; row < Field.rows; row++) {
            this.cards[row] = [];
            for (let col = 0; col < Field.columns; col++) {
                this.cards[row][col] = null;
            }
        }

        this.drawCells();
    }

    drawCells() {
        this.gridRect = [];
        this.validCells = [];

        const periods = [
            [0, 7, 8, 9, 10],
            Array.from({ length: 11 }, (_, i) => i),
            Array.from({ length: 11 }, (_, i) => i),
            Array.from({ length: 11 }, (_, i) => i),
            Array.from({ length: 11 }, (_, i) => i),
            Array.from({ length: 11 }, (_, i) => i),
            Array.from({ length: 11 }, (_, i) => i),
            [0, 1],
        ];

        for (let row = 0; row < Field.rows; row++) {
            this.gridRect[row] = [];
            for (const col of periods[row]) {
                const x = Field.offsetX + col * Field.gridWidth;
                const y = Field.offsetY + row * Field.gridHeight;

                const rect = this.scene.add.rectangle(x, y, Field.gridWidth, Field.gridHeight);
                rect.setOrigin(0, 0);
                rect.setStrokeStyle(1, Field.strokeColor);
                rect.setAlpha(0.6);

                this.gridRect[row][col] = rect;
                this.validCells.push([row, col]);
            }
        }

        // TODO: stroke 라인 수정하기: add.graphics로 가야 할듯?
        const stoke2 = this.scene.add.rectangle(Field.offsetX + 7 * Field.gridWidth, Field.offsetY, Field.gridWidth * 4, Field.gridHeight * 7);
        stoke2.setOrigin(0, 0);
        stoke2.setStrokeStyle(2, Field.strokeColor);
    }

    isValidCell(row, col) {
        return this.validCells.some(([validRow, validCol]) => row === validRow && col === validCol);
    }

    isCellOccupied(row, col) {
        return this.cards[row][col] !== null;
    }

    getValidCellPosition(worldX, worldY) {
        const { row, col } = this.getCellFromPosition(worldX, worldY);
        return !this.isValidCell(row, col) || this.isCellOccupied(row, col) ? { row: null, col: null } : { row, col };
    }

    getCellFromPosition(worldX, worldY) {
        const row = Math.floor((worldY - Field.offsetY) / Field.gridHeight);
        const col = Math.floor((worldX - Field.offsetX) / Field.gridWidth);

        const isValidPosition = col >= 0 && col < Field.columns && row >= 0 && row < Field.rows;
        return isValidPosition ? { row, col } : { row: null, col: null };
    }

    getSnapPosition(row, col) {
        const x = Field.offsetX + col * Field.gridWidth + Field.gap / 2;
        const y = Field.offsetY + row * Field.gridHeight + Field.gap / 2;
        return { x, y };
    }

    updateCardPosition(card, row, col) {
        if (card.prevRow != null && card.prevCol != null) {
            this.cards[card.prevRow][card.prevCol] = null;
        }
        this.cards[row][col] = card;
    }

    isValidOxidationValue(col, oxidationNumbersArray) {
        if (col >= 7 && col <= 10) return true;

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

    checkWeightRule() {
        for (const coord of this.validCells) {
            const row = coord[0];
            const col = coord[1];

            const card = this.cards[row][col];
            const cardIndex = row * 11 + col;

            if (!card) continue;

            for (let i = cardIndex + 1; i < 8 * 11; i++) {
                const newRow = Math.floor(i / 11);
                const newCol = i % 11;

                const isValidCell = this.isValidCell(newRow, newCol);
                if (!isValidCell) continue;

                const cardToCompare = this.cards[newRow][newCol];
                if (!cardToCompare) continue;

                if (card.elementInfo.weight > cardToCompare.elementInfo.weight) return false;
            }
        }

        return true;
    }

    updateHighlight(worldX, worldY) {
        const { row, col } = this.getCellFromPosition(worldX, worldY);

        this.clearHighlight();
        this.highlightCell(row, col);
    }

    // updateHighlight(row, col) {
    //     this.clearHighlight();
    //     this.highlightCell(row, col);
    // }

    highlightCell(row, col) {
        if (row == null || col == null || this.isCellOccupied(row, col)) return;

        this.highlightedCell = { row, col };

        const cell = this.gridRect[row][col];
        if (cell) {
            cell.setStrokeStyle(5, Field.strokeColor);
            cell.setAlpha(1);
        }
    }

    clearHighlight() {
        if (!this.highlightedCell) return;

        const { row, col } = this.highlightedCell;
        const cell = this.gridRect[row][col];
        if (cell) {
            cell.setStrokeStyle(1, Field.strokeColor); // 원래 흰색 테두리로 복원
            cell.setAlpha(0.6);
        }

        Field.highlightedCell = null;
    }
}
