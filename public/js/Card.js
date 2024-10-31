class Card {
    static isDragging = false;
    static draggedCard = null;

    static width = 110;
    static height = 160;

    constructor(element, cardStack, scene) {
        this.elementInfo = element;
        this.cardStack = cardStack;
        this.scene = scene;

        this.initialX = 0;
        this.initialY = 0;
        this.lastValidX = this.initialX;
        this.lastValidY = this.initialY;

        this.inDeck = true;
        this.isOnRightPosition = true;
        this.prevRow = null;
        this.prevCol = null;
        this.row = null;
        this.col = null;
    }

    createContainer() {
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(DEPTH.CARD_ON_DECK);

        // container와 그 size 활용을 위해 위치 조절
        this.setPosition(this.initialX, this.initialY);
    }

    setInitialPosition(x, y) {
        this.initialX = x;
        this.initialY = y;
    }

    setGridPosition(row, col) {
        this.prevRow = this.row;
        this.prevCol = this.col;
        this.row = row;
        this.col = col;
    }

    setPosition(x, y) {
        this.container.x = x + Card.width / 2;
        this.container.y = y + Card.height / 2;
    }

    updatePosition(x, y) {
        this.setPosition(x, y);

        this.lastValidX = x;
        this.lastValidY = y;
    }

    setPositionBasedOnStackIndex(index) {
        const { positionX, positionY, offsetX, offsetY } = this.cardStack;

        const cardX = positionX + index * offsetX;
        const cardY = positionY + index * offsetY;
        this.setInitialPosition(cardX, cardY);
        this.setPosition(cardX, cardY);
    }

    revertToLastValidPosition() {
        this.setPosition(this.lastValidX, this.lastValidY);
    }

    resetToDeck() {
        this.inDeck = true;
        this.row = null;
        this.col = null;

        this.setPosition(this.initialX, this.initialY);
        this.setDefaultBorder();
        this.container.setScrollFactor(0);
        this.container.setDepth(DEPTH.CARD_ON_DECK);
    }

    moveToField() {
        this.inDeck = false;

        this.container.setScrollFactor(1);
        this.container.setDepth(DEPTH.CARD_ON_FIELD);

        this.cardStack.removeCard(this);
        this.cardStack.updateCardsPosition();
    }

    setDefaultBorder() {
        if (this.cardBackground) this.cardBackground.setStrokeStyle(1, 0x000000);
    }

    handleWrongOxidationNumber() {
        if (this.cardBackground) this.cardBackground.setStrokeStyle(3, 0xff2040); // 붉은색 테두리 설정
    }

    updateIsOnRightPosition(isOnRightPosition = this.isOnRightPosition) {
        this.isOnRightPosition = isOnRightPosition;

        if (this.isOnRightPosition) {
            this.setDefaultBorder();
        } else {
            this.handleWrongOxidationNumber();
        }
    }

    setDragEventListeners() {
        this.container.on("dragstart", () => this.handleDragStart());
        this.container.on("drag", (pointer, dragX, dragY) => this.handleDrag(pointer, dragX, dragY));
        this.container.on("dragend", (pointer) => this.handleDragEnd(pointer));
    }

    handleDragStart() {
        Card.isDraggingCard = true;

        Card.draggedCard = this;
        Card.startLocationType = this.inDeck ? "deck" : "field";

        this.container.setDepth(DEPTH.CARD_ON_DRAG);
    }

    handleDrag(pointer, dragX, dragY) {
        this.container.x = dragX;
        this.container.y = dragY;

        const { worldX, worldY } = pointer;

        const field = this.scene.field;
        field.updateHighlight(worldX, worldY);
    }

    handleDragEnd(pointer) {
        Card.isDraggingCard = false;
        this.container.setDepth(DEPTH.CARD_ON_FIELD);

        const field = this.scene.field;
        field.updateHighlight();

        const { worldX, worldY } = pointer;

        const newPosition = field.tryMoveCard(worldX, worldY);
        if (newPosition) {
            if (this.inDeck) this.moveToField();

            const { row, col } = newPosition;
            this.setGridPosition(row, col);

            field.updateCardPosition(this, row, col);
            this.checkFaults(col);

            const { x, y } = field.getSnapPosition(row, col);
            this.updatePosition(x, y);

            this.logCardMove();
            this.scene.handleCardDrop(this);

            // 모든 업데이트/저장 완료 후 드래그 카드 정보 초기화
            Card.draggedCard = null;
            Card.startLocationType = null;
        } else {
            if (this.inDeck) this.resetToDeck(); // 덱으로부터의 이동이었을 때
            else this.revertToLastValidPosition(); // 필드로부터의 이동이었을 때
        }
    }

    checkFaults(col) {
        const field = this.scene.field;
        const isValidOxidation = field.isValidOxidationValue(col, this.elementInfo.oxidationNumbersArray);
        this.updateIsOnRightPosition(isValidOxidation);
    }

    logCardMove() {
        const event = new CustomEvent("cardMoved", {
            detail: {
                cardNumber: this.elementInfo.number,
                startLocationType: Card.startLocationType,
                startLocation: { row: this.prevRow, column: this.prevCol },
                endLocationType: "field",
                endLocation: { row: this.row, column: this.col },
                isCorrectMove: this.isOnRightPosition,
            },
        });
        document.dispatchEvent(event);
    }
}

class GeneralCard extends Card {
    static backgroundColor = 0xf6f6f6;

    constructor(element, cardStack, scene) {
        super(element, cardStack, scene);
        this.cardType = "GeneralCard";

        this.createContainer();
        this.setDragEventListeners();
        if (this.cardStack) this.cardStack.addCard(this);
    }

    // 카드의 컨테이너를 생성하고 필요한 그래픽 요소를 추가
    createContainer() {
        super.createContainer();

        // 카드 배경(사각형) 생성
        this.cardBackground = this.scene.add.rectangle(0, 0, Card.width, Card.height, GeneralCard.backgroundColor);
        this.cardBackground.setAlpha(0.95);
        this.setDefaultBorder();

        const colorLine = this.scene.add.rectangle(-Card.width / 2 + 0.5, -Card.height / 2 + 0.5, Card.width - 1, Card.height / 8 - 1, this.elementInfo.color);
        colorLine.setOrigin(0, 0);

        const weightText = this.scene.add.text(-48, -55, this.elementInfo.weight, { font: "bold 21px Arial", fill: "#000" });
        weightText.setOrigin(0, 0);

        const symbolText = this.scene.add.text(0, -15, this.elementInfo.symbol, { font: "bold 36px Pretendard", fill: "#000" });
        symbolText.setOrigin(0.5, 0.5);

        const nameText = this.scene.add.text(0, 15, this.elementInfo.name, { font: "13px Arial", fill: "#000" });
        nameText.setOrigin(0.5, 0.5);

        const positiveOxidationNumberText = this.scene.add.text(0, 40, this.elementInfo.oxidationNumbers.positive, {
            font: "bold 16px Arial",
            fill: "#FF2040",
            align: "center",
        });
        positiveOxidationNumberText.setOrigin(0.5, 0.5);

        const negativeOxidationNumberText = this.scene.add.text(0, 60, this.elementInfo.oxidationNumbers.negative, {
            font: "bold 16px Arial",
            fill: "#4020FF",
            align: "center",
        });
        negativeOxidationNumberText.setOrigin(0.5, 0.5);

        // 컨테이너에 모든 요소 추가
        this.container.add([this.cardBackground, colorLine, symbolText, nameText, weightText, positiveOxidationNumberText, negativeOxidationNumberText]);

        // 상호작용 설정
        this.container.setSize(Card.width, Card.height);
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
    }
}

class NobleCard extends Card {
    static backgroundColor = 0xc9ff9f;

    constructor(element, cardStack, scene) {
        super(element, cardStack, scene);
        this.cardType = "NobleCard";

        this.createContainer();
        this.setDragEventListeners();
        if (this.cardStack) this.cardStack.addCard(this);
    }

    // 카드의 컨테이너를 생성하고 필요한 그래픽 요소를 추가
    createContainer() {
        super.createContainer();

        // 카드 배경(사각형) 생성
        this.cardBackground = this.scene.add.rectangle(0, 0, Card.width, Card.height, NobleCard.backgroundColor);
        this.setDefaultBorder();

        const weightText = this.scene.add.text(-48, -55, this.elementInfo.weight, { font: "bold 21px Arial", fill: "#000" });
        weightText.setOrigin(0, 0);

        const symbolText = this.scene.add.text(0, -15, this.elementInfo.symbol, { font: "bold 36px Pretendard", fill: "#000" });
        symbolText.setOrigin(0.5, 0.5);

        const nameText = this.scene.add.text(0, 15, this.elementInfo.name, { font: "13px Arial", fill: "#000" });
        nameText.setOrigin(0.5, 0.5);

        const oxidationNumberText = this.scene.add.text(0, 50, "0", {
            font: "bold 16px Arial",
            fill: "#000000",
            align: "center",
        });
        oxidationNumberText.setOrigin(0.5, 0.5);

        // 컨테이너에 모든 요소 추가
        this.container.add([this.cardBackground, symbolText, nameText, weightText, oxidationNumberText]);

        // 상호작용 설정
        this.container.setSize(Card.width, Card.height);
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
    }
}

class EkaCard extends Card {
    static backgroundColor = 0xffec9f;

    constructor(element, cardStack, scene) {
        super(element, cardStack, scene);
        this.cardType = "EkaCard";

        this.createContainer();
        this.setDragEventListeners();
        if (this.cardStack) this.cardStack.addCard(this);
    }

    createContainer() {
        super.createContainer();

        // 카드 배경(사각형) 생성
        this.cardBackground = this.scene.add.rectangle(0, 0, Card.width, Card.height, EkaCard.backgroundColor);
        this.setDefaultBorder();

        const weightText = this.scene.add.text(-48, -55, this.elementInfo.weight, { font: "bold 21px Arial", fill: "#000" });
        weightText.setOrigin(0, 0);

        const symbolText = this.scene.add.text(0, -15, this.elementInfo.symbol, { font: "bold 36px Pretendard", fill: "#000" });
        symbolText.setOrigin(0.5, 0.5);

        const nameText = this.scene.add.text(0, 15, this.elementInfo.name, { font: "13px Arial", fill: "#000" });
        nameText.setOrigin(0.5, 0.5);

        const positiveOxidationNumberText = this.scene.add.text(0, 40, this.elementInfo.oxidationNumbers.positive, {
            font: "bold 16px Arial",
            fill: "#FF2040",
            align: "center",
        });
        positiveOxidationNumberText.setOrigin(0.5, 0.5);

        const negativeOxidationNumberText = this.scene.add.text(0, 60, this.elementInfo.oxidationNumbers.negative, {
            font: "bold 16px Arial",
            fill: "#4020FF",
            align: "center",
        });
        negativeOxidationNumberText.setOrigin(0.5, 0.5);

        // 컨테이너에 모든 요소 추가
        this.container.add([this.cardBackground, symbolText, nameText, weightText, positiveOxidationNumberText, negativeOxidationNumberText]);

        // 상호작용 설정
        this.container.setSize(Card.width, Card.height);
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
    }
}
