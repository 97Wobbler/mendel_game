class Phase1To3Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Phase1To3Scene" });
        this.characterWidth = 350;
        this.characterHeight = 250;
        this.deckAreaWidth = 350;
    }

    preload() {
        this.load.text("elementData", "data/Elements.csv");
        this.load.image("mendeleevNormal", "img/mendeleev_normal.png");
        this.load.image("mendeleevConfused", "img/mendeleev_confused.png");
        this.load.image("mendeleevThumbsUp", "img/mendeleev_thumbsup.png");
        this.load.image("mendeleevCard", "img/joker.png");
    }

    create() {
        const elementData = this.cache.text.get("elementData");
        Element.loadElementsFromCSV(elementData);

        // Phase 1~3 시작
        gameManager.startPhase1To3();

        const gridRow = 8;
        const gridColumn = 10;
        const offsetX = 50;
        const offsetY = 50;

        // 필드 객체 생성
        this.field = new Field(gridRow, gridColumn, offsetX, offsetY, this);

        const boundWidth = 2 * offsetX + gridColumn * Field.gridWidth + this.characterWidth;
        const boundHeight = 2 * offsetY + gridRow * Field.gridHeight;

        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, boundWidth, boundHeight);
        this.camera.setBackgroundColor("#D1CEB6");

        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown && !isDraggingCard) {
                this.camera.scrollX -= pointer.velocity.x / this.camera.zoom / 10;
                this.camera.scrollY -= pointer.velocity.y / this.camera.zoom / 10;
            }
        });

        // 필드 헤더 및 UI 생성
        this.createFixedHeaders();
        this.createFixedUI();
        this.mendeleevUI = new MendeleevUI(this);

        uiManager.showPopup("1단계", "산화수에 맞게 원소 카드를 배치하세요!", () => {
            this.createPhase1Cards(this.deckOffsetX);
        });

        this.scale.on("resize", this.resizeUI, this);
    }

    createFixedHeaders() {
        this.createFixedRow();
        this.createFixedColumn();

        const temporarySquare = this.add.rectangle(0, 0, 50, 50, 0xd1ceb6);
        temporarySquare.setOrigin(0, 0);
        temporarySquare.setScrollFactor(0);
        temporarySquare.setDepth(DEPTH.FIELD_FIXED_UI);
    }

    // 정답/오답 피드백을 호출하는 메소드
    handleCardDrop(isCorrect) {
        const messageType = isCorrect ? "correct" : "wrong";
        this.mendeleevUI.showFeedback(messageType);

        if (isCorrect) {
            gameManager.updateScore(10); // 정답 시 점수 추가
        }

        if (this.elementCardStack.isEmpty() && this.field.isFull()) {
            uiManager.showPopup(`Stage ${gameManager.currentPhase} Complete`, "Well done!", () => {
                gameManager.completeCurrentPhase(this);
            });
        }
    }

    update() {
        this.headerCells.x = -this.camera.scrollX;
        this.headerColumnCells.y = -this.camera.scrollY;
    }

    createFixedRow() {
        const headerArea = this.add.container(this.field.offsetX, 0);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.scale.width - this.characterWidth - this.field.offsetX;
        const backgroundRectHeight = this.field.offsetX - 2;

        this.headerRowBackground = this.add.rectangle(0, 0, backgroundRectWidth, backgroundRectHeight, 0xd1ceb6);
        this.headerRowBackground.setOrigin(0, 0);
        this.headerRowBackground.setScrollFactor(0);

        headerArea.add(this.headerRowBackground);

        this.headerCells = this.add.container(0, 0);

        const cellWidth = Field.gridWidth - 2;
        const cellHeight = 50;

        const cellOffsetX = 1;
        const cellOffsetY = backgroundRectHeight - cellHeight;

        const textOffsetX = cellOffsetX + cellWidth / 2;
        const textOffsetY = cellOffsetY + cellHeight / 2;

        const headerData = ["+1", "+2", "+3", "+4 -4", "+5 -3", "+6 -2", "+7 -1"];
        headerData.forEach((headerText, i) => {
            const headerCell = this.add.rectangle(cellOffsetX + i * Field.gridWidth, cellOffsetY, cellWidth, cellHeight, 0xffffff);
            headerCell.setOrigin(0, 0);
            headerCell.setAlpha(0.3);

            const headerCellText = this.add.text(textOffsetX + i * Field.gridWidth, textOffsetY, headerText, {
                font: "italic 20px Arial",
                fill: "#FF2040",
            });
            headerCellText.setOrigin(0.5, 0.5);

            this.headerCells.add(headerCell);
            this.headerCells.add(headerCellText);
        });

        const eighthCell = this.add.rectangle(cellOffsetX + 7 * Field.gridWidth, cellOffsetY, Field.gridWidth * 3 - 2, cellHeight, 0xffffff);
        eighthCell.setOrigin(0, 0);
        eighthCell.setAlpha(0.3);
        const eighthCellText = this.add.text(textOffsetX + 8 * Field.gridWidth, textOffsetY, "Trash Bin", {
            font: "italic 20px Arial",
            fill: "#FF2040",
        });
        eighthCellText.setOrigin(0.5, 0.5);

        this.headerCells.add(eighthCell);
        this.headerCells.add(eighthCellText);

        headerArea.add(this.headerCells);
    }

    createFixedColumn() {
        const headerArea = this.add.container(0, this.field.offsetY);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.field.offsetY - 2;
        const backgroundRectHeight = this.scale.height;

        this.headerColumnBackground = this.add.rectangle(0, 0, backgroundRectWidth, backgroundRectHeight, 0xd1ceb6);
        this.headerColumnBackground.setOrigin(0, 0);
        this.headerColumnBackground.setScrollFactor(0);

        headerArea.add(this.headerColumnBackground);

        this.headerColumnCells = this.add.container(0, 0);

        const cellHeight = Field.gridHeight - 2;
        const cellWidth = 50;

        const cellOffsetX = backgroundRectWidth - cellWidth;
        const cellOffsetY = 1;

        const textOffsetX = cellOffsetX + cellWidth / 2;
        const textOffsetY = cellOffsetY + cellHeight / 2;

        const periodData = Array.from({ length: 8 }, (_, i) => i + 1);
        periodData.forEach((periodText, i) => {
            const periodCell = this.add.rectangle(cellOffsetX, cellOffsetY + i * Field.gridHeight, cellWidth, cellHeight, 0xffffff);
            periodCell.setOrigin(0, 0);
            periodCell.setAlpha(0.3);

            const periodCellText = this.add.text(textOffsetX, textOffsetY + i * Field.gridHeight, periodText, {
                font: "16px Arial",
                fill: "#807d65",
            });
            periodCellText.setOrigin(0.5, 0.5); // 텍스트를 셀 중앙에 배치

            this.headerColumnCells.add(periodCell);
            this.headerColumnCells.add(periodCellText);
        });

        headerArea.add(this.headerColumnCells);
    }

    createFixedUI() {
        this.characterOffsetX = this.scale.width - this.characterWidth;
        this.characterOffsetY = 0;
        this.characterRect = this.add
            .rectangle(this.characterOffsetX, this.characterOffsetY, this.characterWidth, this.characterHeight, 0xe8e6db)
            .setScrollFactor(0);
        this.characterRect.setOrigin(0, 0);
        this.characterRect.setDepth(DEPTH.FIXED_UI);

        this.deckAreaHeight = this.scale.height - this.characterHeight;
        this.deckOffsetX = this.scale.width - this.deckAreaWidth;
        this.deckOffsetY = this.characterOffsetY + this.characterHeight;

        this.deckRect = this.add.rectangle(this.deckOffsetX, this.deckOffsetY, this.deckAreaWidth, this.deckAreaHeight, 0x807d65).setScrollFactor(0);
        this.deckRect.setOrigin(0, 0);
        this.deckRect.setDepth(DEPTH.FIXED_UI);
    }

    resizeUI(gameSize, baseSize, displaySize, resolution) {
        if (!this.characterRect || !this.deckRect) return;

        this.characterOffsetX = gameSize.width - this.characterWidth;
        this.characterOffsetY = 0;
        this.deckAreaHeight = gameSize.height - this.characterHeight;
        this.deckOffsetX = gameSize.width - this.deckAreaWidth;
        this.deckOffsetY = this.characterOffsetY + this.characterHeight;

        if (this.characterRect) {
            this.characterRect.setPosition(this.characterOffsetX, this.characterOffsetY);
        }

        if (this.deckRect) {
            this.deckRect.setPosition(this.deckOffsetX, this.deckOffsetY);
            this.deckRect.setSize(this.deckAreaWidth, this.deckAreaHeight);
        }

        if (this.mendeleevUI) {
            this.mendeleevUI.updatePosition();
        }

        if (this.elementCardStack) {
            this.elementCardStackOffsetX = this.deckOffsetX + 50;
            this.elementCardStackOffsetY = this.scale.height - Card.height - 100;
            this.elementCardStack.updateCardsPosition(this.elementCardStackOffsetX, this.elementCardStackOffsetY);
        }

        if (this.mendeleevCardStack) {
            this.mendeleevCardStackOffsetX = this.elementCardStackOffsetX + Card.width + 50;
            this.mendeleevCardStackOffsetY = this.elementCardStackOffsetY;
            this.mendeleevCardStack.updateCardsPosition(this.mendeleevCardStackOffsetX, this.mendeleevCardStackOffsetY);
        }

        if (this.headerRowBackground) this.headerRowBackground.setSize(this.scale.width - this.characterWidth - this.field.offsetX, this.field.offsetX - 2);
        if (this.headerColumnBackground) this.headerColumnBackground.setSize(this.field.offsetY - 2, this.scale.height);
    }

    createPhase1Cards() {
        const stage1cardsIndex = [
            1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34, 35, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 55, 56,
        ];

        this.elementCardStackOffsetX = this.deckOffsetX + 50;
        this.elementCardStackOffsetY = this.scale.height - Card.height - 100;
        this.elementCardStack = new CardStack(this, this.elementCardStackOffsetX, this.elementCardStackOffsetY);

        for (const elementIndex of stage1cardsIndex) {
            new GeneralCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }

        this.mendeleevCardStackOffsetX = this.elementCardStackOffsetX + Card.width + 50;
        this.mendeleevCardStackOffsetY = this.elementCardStackOffsetY;
        this.mendeleevCardStack = new MendeleevCardStack(this, this.mendeleevCardStackOffsetX, this.mendeleevCardStackOffsetY);

        for (let i = 0; i < 20; i++) {
            new MendeleevCard(this.mendeleevCardStack, this);
        }
    }

    createPhase2Cards() {
        const stage2cardsIndex = [2, 10, 18, 36, 54];

        for (const elementIndex of stage2cardsIndex) {
            new NobleCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }
    }

    createPhase3Cards() {
        const stage3cardsIndex = [21, 31, 32, 43];

        for (const elementIndex of stage3cardsIndex) {
            new EkaCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }
    }
}
