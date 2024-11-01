class GameStageManager extends Phaser.Scene {
    constructor() {
        super({ key: "GameStageManager" });

        this.phases = [new Phase1(this), new Phase2(this), new Phase3(this)];
        this.currentPhase = null;

        // TODO: 전체 UI 관리하는 클래스로 옮기기
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
        game.scale.resize(window.innerWidth - 10, window.innerHeight - 10);

        const elementData = this.cache.text.get("elementData");
        Element.loadElementsFromCSV(elementData);

        this.createFieldAndHeaders();
        this.fixedUI = new FixedUI(this);
        this.mendeleevUI = this.fixedUI.mendeleevUI;

        this.setCamera();
        this.setFieldDraggle();

        this.scale.on("resize", this.resizeUI, this);

        // TODO: fix contents
        const slides = [
            { image: "img/1-1.png", text: "주어진 원소 카드를 필드에 배치합니다." },
            { image: "img/1-2.png", text: "각 열의 산화수를 만족하도록 카드를 배치해야 합니다." },
            { image: "img/1-3.png", text: "Trash Bin에 있는 카드는 산화수 규칙을 무시합니다." },
            { image: "img/1-4.png", text: "모든 카드는 좌측 상단부터 원자량 순서대로 배치되어야 합니다." },
        ];

        uiManager.showOverlay("Stage 1 - Historical Context", slides, () => {
            this.startGame();
        });
    }

    startGame() {
        this.currentPhaseIndex = 0;
        this.startPhase(this.currentPhaseIndex);
    }

    endGame() {
        document.dispatchEvent(new Event("gameEnded"));
        uiManager.showEndScreen(this.score);
    }

    startPhase(index) {
        if (this.currentPhase) this.currentPhase.destroy();
        this.currentPhase = this.phases[index];
        if (this.currentPhase) this.currentPhase.init();

        const phaseNumber = this.currentPhaseIndex + 1;
        switch (phaseNumber) {
            case 1: {
                // TODO: fix contents

                this.currentPhase.onComplete(() => {
                    const slides = [
                        { image: "img/slide1.png", text: "This is the first slide description." },
                        { image: "img/slide2.png", text: "Second slide provides more insight." },
                        { image: "img/slide3.png", text: "The final slide, wrapping up the stage." },
                    ];

                    uiManager.showOverlay("Stage 2 - Historical Context", slides, () => {
                        this.currentPhaseIndex++;
                        this.startPhase(this.currentPhaseIndex);
                    });
                });
                break;
            }
            case 2: {
                // TODO: fix contents

                this.currentPhase.onComplete(() => {
                    const slides = [
                        { image: "img/slide1.png", text: "This is the first slide description." },
                        { image: "img/slide2.png", text: "Second slide provides more insight." },
                        { image: "img/slide3.png", text: "The final slide, wrapping up the stage." },
                    ];

                    uiManager.showOverlay("Stage 3 - Historical Context", slides, () => {
                        this.currentPhaseIndex++;
                        this.startPhase(this.currentPhaseIndex);
                    });
                });
                break;
            }
            case 3: {
                // TODO: fix contents

                this.currentPhase.onComplete(() => {
                    const slides = [
                        { image: "img/slide1.png", text: "This is the first slide description." },
                        { image: "img/slide2.png", text: "Second slide provides more insight." },
                        { image: "img/slide3.png", text: "The final slide, wrapping up the stage." },
                    ];

                    uiManager.showOverlay("All Completed!", slides, () => {
                        this.endGame();
                    });
                });
                break;
            }
        }
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

        const boundWidth = 2 * Field.offsetX + Field.columns * Field.gridWidth + FixedUI.fixedUIWidth;
        const boundHeight = 2 * Field.offsetY + Field.rows * Field.gridHeight;
        this.camera.setBounds(0, 0, boundWidth, boundHeight);
    }

    setFieldDraggle() {
        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown && !Card.isDraggingCard) {
                this.camera.scrollX -= pointer.velocity.x / this.camera.zoom / 8;
                this.camera.scrollY -= pointer.velocity.y / this.camera.zoom / 8;
            }
        });
    }

    createFixedRow() {
        const headerArea = this.add.container(Field.offsetX, 0);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.scale.width - FixedUI.fixedUIWidth - Field.offsetX;
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

    handleCardDrop(card) {
        this.currentPhase.checkMissionCompletion(card);
    }

    resizeUI(gameSize, baseSize, displaySize, resolution) {
        this.fixedUI.resize();

        if (this.headerRowBackground) this.headerRowBackground.setSize(this.scale.width - FixedUI.fixedUIWidth - Field.offsetX, Field.offsetX - 2);
        if (this.headerColumnBackground) this.headerColumnBackground.setSize(Field.offsetY - 2, this.scale.height);

        if (!this.characterRect || !this.deckRect) return;

        this.characterOffsetX = gameSize.width - FixedUI.fixedUIWidth;
        this.characterOffsetY = 0;
        this.deckAreaHeight = gameSize.height - FixedUI.characterHeight;
        this.deckOffsetX = gameSize.width - this.deckAreaWidth;
        this.deckOffsetY = this.characterOffsetY + FixedUI.characterHeight;
    }
}

class Phase1 {
    constructor(scene) {
        this.scene = scene;
        this.missions = [];
        this.callbackOnCompleted = null;
    }

    init() {
        this.createCards();
        this.createMissionTexts();
    }

    createCards() {
        const stage1cardsIndex = [
            1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34, 35, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 55, 56,
        ];

        for (const elementIndex of stage1cardsIndex) {
            new GeneralCard(Element.getElementByNumber(elementIndex), this.scene.fixedUI.elementCardStack, this.scene);
        }

        this.scene.fixedUI.elementCardStack.sortAndUpdateCardsPosition();
    }

    createMissionTexts() {
        this.missions.push(new MissionText(this.scene, this.scene.fixedUI.container, "모든 원소 카드의 원자량 순서 배치"));
        this.missions.push(new MissionText(this.scene, this.scene.fixedUI.container, "모든 원소 카드의 산화수 조건을 만족"));

        this.missions.forEach((mission, index) => {
            mission.setPosition(25, 350 + index * 30);
        });
    }

    checkMissionCompletion(card) {
        const isPlacedOnTrashBin = card.col >= 7;
        const hasAllCardPlaced = this.scene.fixedUI.elementCardStack.isEmpty();
        const isRightWeightOrder = this.scene.field.checkWeightRule();
        const isRightOxidationNumbers = this.scene.field.checkOxidationRule();

        if (isRightWeightOrder) {
            this.missions[0].handleVaildCondition();
        } else {
            this.missions[0].handleInvaildCondition();
        }

        if (isRightOxidationNumbers) {
            this.missions[1].handleVaildCondition();
        } else {
            this.missions[1].handleInvaildCondition();
        }

        const allMissionsCompleted = hasAllCardPlaced && isRightWeightOrder && isRightOxidationNumbers;
        if (allMissionsCompleted) {
            this.completeCallback();
        }

        const mendeleevUI = this.scene.mendeleevUI;

        if (isPlacedOnTrashBin) {
            mendeleevUI.showFeedback("It's OK.", "neutral");
        } else if (!isRightWeightOrder) {
            mendeleevUI.showFeedback("Wrong! Keep the order!", "wrong");
        } else if (!isRightOxidationNumbers) {
            mendeleevUI.showFeedback("Wrong! Check again.", "wrong");
        } else {
            mendeleevUI.showFeedback("Correct!", "correct");
        }
    }

    onComplete(callback) {
        this.completeCallback = callback;
    }

    destroy() {
        this.missions.forEach((mission) => {
            mission.remove();
        });
    }
}

class Phase2 {
    constructor(scene) {
        this.scene = scene;
        this.missions = [];
        this.callbackOnCompleted = null;
    }

    init() {
        this.createCards();
        this.createMissionTexts();
    }

    createCards() {
        const stage2cardsIndex = [2, 10, 18, 36, 54];

        for (const elementIndex of stage2cardsIndex) {
            new NobleCard(Element.getElementByNumber(elementIndex), this.scene.fixedUI.elementCardStack, this.scene);
        }

        this.scene.fixedUI.elementCardStack.sortAndUpdateCardsPosition();
    }

    createMissionTexts() {
        this.missions.push(new MissionText(this.scene, this.scene.fixedUI.container, "모든 원소 카드의 산화수 만족하기"));

        this.missions.forEach((mission, index) => {
            mission.setPosition(25, 350 + index * 30);
        });
    }

    checkMissionCompletion(card) {
        const isPlacedOnTrashBin = card.col >= 7;
        const hasAllCardPlaced = this.scene.fixedUI.elementCardStack.isEmpty();
        const isRightOxidationNumbers = this.scene.field.checkOxidationRule();

        if (isRightOxidationNumbers) {
            this.missions[0].handleVaildCondition();
        } else {
            this.missions[0].handleInvaildCondition();
        }

        const allMissionsCompleted = hasAllCardPlaced && isRightOxidationNumbers;
        if (allMissionsCompleted) {
            this.completeCallback();
        }

        const mendeleevUI = this.scene.mendeleevUI;

        if (isPlacedOnTrashBin) {
            mendeleevUI.showFeedback("It's OK.", "neutral");
        } else if (!isRightOxidationNumbers) {
            mendeleevUI.showFeedback("Wrong! Check again.", "wrong");
        } else {
            mendeleevUI.showFeedback("Correct!", "correct");
        }
    }

    onComplete(callback) {
        this.completeCallback = callback;
    }

    destroy() {
        this.missions.forEach((mission) => {
            mission.remove();
        });
    }
}

class Phase3 {
    constructor(scene) {
        this.scene = scene;
        this.missions = [];
        this.callbackOnCompleted = null;
    }

    init() {
        this.createCards();
        this.createMissionTexts();
    }

    createCards() {
        const stage3cardsIndex = [21, 31, 32, 43];

        for (const elementIndex of stage3cardsIndex) {
            new EkaCard(Element.getElementByNumber(elementIndex), this.scene.fixedUI.elementCardStack, this.scene);
        }

        this.scene.fixedUI.elementCardStack.sortAndUpdateCardsPosition();
    }

    createMissionTexts() {
        this.missions.push(new MissionText(this.scene, this.scene.fixedUI.container, "모든 원소의 산화수 만족시키기"));

        this.missions.forEach((mission, index) => {
            mission.setPosition(25, 350 + index * 30);
        });
    }

    checkMissionCompletion(card) {
        const isPlacedOnTrashBin = card.col >= 7;
        const hasAllCardPlaced = this.scene.fixedUI.elementCardStack.isEmpty();
        const isRightOxidationNumbers = this.scene.field.checkOxidationRule();

        if (isRightOxidationNumbers) {
            this.missions[0].handleVaildCondition();
        } else {
            this.missions[0].handleInvaildCondition();
        }

        const allMissionsCompleted = hasAllCardPlaced && isRightOxidationNumbers;
        if (allMissionsCompleted) {
            this.completeCallback();
        }

        const mendeleevUI = this.scene.mendeleevUI;

        if (isPlacedOnTrashBin) {
            mendeleevUI.showFeedback("It's OK.", "neutral");
        } else if (!isRightOxidationNumbers) {
            mendeleevUI.showFeedback("Wrong! Check again.", "wrong");
        } else {
            mendeleevUI.showFeedback("Correct!", "correct");
        }
    }

    onComplete(callback) {
        this.completeCallback = callback;
    }

    destroy() {
        this.missions.forEach((mission) => {
            mission.remove();
        });
    }
}
