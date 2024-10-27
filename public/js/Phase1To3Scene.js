class Phase1To3Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Phase1To3Scene" });

        // TODO: 전체 UI 관리하는 클래스로 옮기기
        this.characterWidth = 350;
        this.characterHeight = 250;
        this.deckAreaWidth = 350;
    }

    preload() {
        this.load.text("elementData", "data/Elements.csv");
        this.load.image("mendeleevNormal", "img/mendeleev_normal.png");
        this.load.image("mendeleevConfused", "img/mendeleev_confused.png");
        this.load.image("mendeleevThumbsUp", "img/mendeleev_thumbsup.png");
    }

    update() {
        this.headerCells.x = -this.camera.scrollX;
        this.headerColumnCells.y = -this.camera.scrollY;
    }

    create() {
        const elementData = this.cache.text.get("elementData");
        Element.loadElementsFromCSV(elementData);

        gameManager.startGame();

        this.createFieldAndHeaders();
        this.fixedUI = new FixedUI(this);
        this.mendeleevUI = this.fixedUI.mendeleevUI;

        this.setCamera();
        this.setFieldDraggle();

        this.scale.on("resize", this.resizeUI, this);

        uiManager.showPopup("1단계", "산화수에 맞게 원소 카드를 배치하세요!", () => {
            this.createPhase1Cards();
        });
    }

    createFieldAndHeaders() {
        this.field = new Field(this);

        this.createFixedRow();
        this.createFixedColumn();

        const temporarySquare = this.add.rectangle(0, 0, Field.offsetX, Field.offsetY, 0xd1ceb6);
        temporarySquare.setOrigin(0, 0);
        temporarySquare.setScrollFactor(0);
        temporarySquare.setDepth(DEPTH.FIELD_FIXED_UI);
    }

    setCamera() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#D1CEB6");

        const boundWidth = 2 * Field.offsetX + Field.columns * Field.gridWidth + this.characterWidth;
        const boundHeight = 2 * Field.offsetY + Field.rows * Field.gridHeight;
        this.camera.setBounds(0, 0, boundWidth, boundHeight);
    }

    setFieldDraggle() {
        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown && !CardMove.isDraggingCard) {
                this.camera.scrollX -= pointer.velocity.x / this.camera.zoom / 8;
                this.camera.scrollY -= pointer.velocity.y / this.camera.zoom / 8;
            }
        });
    }

    createFixedRow() {
        const headerArea = this.add.container(Field.offsetX, 0);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.scale.width - this.characterWidth - Field.offsetX;
        const backgroundRectHeight = Field.offsetX - 2;

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

        const textGap = 10;

        const positiveNumbers = ["+1", "+2", "+3", "+4", "+5", "+6", "+7"];
        const negativeNumbers = ["", "", "", "-4", "-3", "-2", "-1"];

        for (let i = 0; i < 7; i++) {
            const headerCell = this.add.rectangle(cellOffsetX + i * Field.gridWidth, cellOffsetY, cellWidth, cellHeight, 0xffffff);
            headerCell.setOrigin(0, 0);
            headerCell.setAlpha(0.3);
            this.headerCells.add(headerCell);

            const positiveNumber = this.add.text(textOffsetX + i * Field.gridWidth - textGap / 2, textOffsetY, positiveNumbers[i], {
                font: "bold 22px Arial",
                fill: "#FF2040",
            });
            positiveNumber.setOrigin(1, 0.5);
            this.headerCells.add(positiveNumber);

            const negativeNumber = this.add.text(textOffsetX + i * Field.gridWidth + textGap / 2, textOffsetY, negativeNumbers[i], {
                font: "bold 22px Arial",
                fill: "#4020FF",
            });
            negativeNumber.setOrigin(0, 0.5);
            this.headerCells.add(negativeNumber);
        }

        const eighthCell = this.add.rectangle(cellOffsetX + 7 * Field.gridWidth, cellOffsetY, Field.gridWidth * 4 - 2, cellHeight, 0xffffff);
        eighthCell.setOrigin(0, 0);
        eighthCell.setAlpha(0.3);
        const eighthCellText = this.add.text(textOffsetX + 8.5 * Field.gridWidth, textOffsetY, "Trash Bin", {
            font: "bold 22px Arial",
            fill: "#FF2040",
        });
        eighthCellText.setOrigin(0.5, 0.5);

        this.headerCells.add(eighthCell);
        this.headerCells.add(eighthCellText);

        headerArea.add(this.headerCells);
    }

    createFixedColumn() {
        const headerArea = this.add.container(0, Field.offsetY);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = Field.offsetY - 2;
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
                font: "bold 22px Arial",
                fill: "#807d65",
            });
            periodCellText.setOrigin(0.5, 0.5); // 텍스트를 셀 중앙에 배치

            this.headerColumnCells.add(periodCell);
            this.headerColumnCells.add(periodCellText);
        });

        headerArea.add(this.headerColumnCells);
    }

    handleCardDrop(isCorrect) {
        const messageType = isCorrect ? "correct" : "wrong";
        this.mendeleevUI.showFeedback(messageType);

        const hasAllCardPlaced = this.elementCardStack.isEmpty();
        const isRightWeightOrder = this.field.checkWeightRule();
        const isRightOxidationNumbers = true; // TODO: 모든 카드가 산화수 문제가 없는지 확인하는 함수 넣기

        if (hasAllCardPlaced && isRightWeightOrder && isRightOxidationNumbers) {
            uiManager.showPopup(`Stage ${gameManager.currentPhase} Complete`, "Well done!", () => {
                gameManager.completeCurrentPhase(this);
            });
        }
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

        if (this.headerRowBackground) this.headerRowBackground.setSize(this.scale.width - this.characterWidth - Field.offsetX, Field.offsetX - 2);
        if (this.headerColumnBackground) this.headerColumnBackground.setSize(Field.offsetY - 2, this.scale.height);
    }

    createPhase1Cards() {
        const stage1cardsIndex = [
            1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34, 35, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 55, 56,
        ];

        this.elementCardStackOffsetX = this.fixedUI.offsetX + 50;
        this.elementCardStackOffsetY = this.scale.height - Card.height - 100;
        this.elementCardStack = new CardStack(this, this.elementCardStackOffsetX, this.elementCardStackOffsetY);

        for (const elementIndex of stage1cardsIndex) {
            new GeneralCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }

        this.elementCardStack.sortAndUpdateCardsPosition();
    }

    createPhase2Cards() {
        const stage2cardsIndex = [2, 10, 18, 36, 54];

        for (const elementIndex of stage2cardsIndex) {
            new NobleCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }

        this.elementCardStack.sortAndUpdateCardsPosition();
    }

    createPhase3Cards() {
        const stage3cardsIndex = [21, 31, 32, 43];

        for (const elementIndex of stage3cardsIndex) {
            new EkaCard(Element.getElementByNumber(elementIndex), this.elementCardStack, this);
        }

        this.elementCardStack.sortAndUpdateCardsPosition();
    }
}
