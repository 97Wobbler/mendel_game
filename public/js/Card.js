class Card {
    static width = 110;
    static height = 160;

    static draggedCard = null;
    static startLocationType = null;

    constructor(element, cardStack, scene) {
        this.elementInfo = element;
        this.cardStack = cardStack;
        this.initialX = 300;
        this.initialY = 300;
        this.scene = scene;
        this.isOnRightPosition = true;

        this.inDeck = !!cardStack; // 덱에 있는지 여부
        this.row = null;
        this.col = null;
        this.lastValidX = this.initialX;
        this.lastValidY = this.initialY;
    }

    destroyCard() {
        if (this.cardStack) this.cardStack.removeCard(this);
        if (this.container) this.container.destroy();

        this.scene = null;
        this.elementInfo = null;
        this.cardStack = null;
    }

    createContainer() {
        // 컨테이너 생성
        this.container = this.scene.add.container(500, 600);
        this.container.setScrollFactor(0);
        this.container.setDepth(DEPTH.CARD_ON_DECK);

        // container와 그 size 활용을 위해 위치 조절
        this.setPosition(this.initialX, this.initialY);
    }

    moveToField() {
        this.container.setScrollFactor(1); // 필드 카메라와 함께 이동
        this.container.setDepth(DEPTH.CARD_ON_FIELD);
        this.container.setVisible(true);

        if (this.cardStack) this.cardStack.removeCard(this);
    }

    resetToDeck() {
        this.setPosition(this.initialX, this.initialY);
        this.setDefaultBorder();
        this.container.setScrollFactor(0);
        this.container.setDepth(DEPTH.CARD_ON_DECK);

        this.inDeck = true;
        this.row = null;
        this.col = null;
    }

    setPosition(x, y) {
        this.container.x = x + Card.width / 2;
        this.container.y = y + Card.height / 2;
    }

    setInitialPosition(x, y) {
        this.initialX = x;
        this.initialY = y;
    }

    updatePosition(x, y) {
        this.setPosition(x, y);

        this.lastValidX = x;
        this.lastValidY = y;
        this.inDeck = false;
    }

    revertToLastValidPosition() {
        this.setPosition(this.lastValidX, this.lastValidY);
    }

    handleWrongPosition() {
        if (this.cardBackground) {
            this.cardBackground.setStrokeStyle(2, 0xff2040); // 붉은색 테두리 설정
        }
    }

    // 올바른 위치에 배치된 경우 붉은 테두리 제거
    setDefaultBorder() {
        if (this.cardBackground) {
            this.cardBackground.setStrokeStyle(1, 0);
        }
    }

    setDragEventListeners() {
        let lastHighlightedCell = null; // 마지막으로 강조된 셀

        this.container.on("dragstart", (pointer) => {
            isDraggingCard = true;

            // 카드 드래그가 시작되면 마스크를 해제
            this.container.clearMask();

            // 카드 드래그 종료 시점에 호출되는 logCardMove 메서드를 위한 기록
            Card.draggedCard = this;
            Card.startLocationType = this.inDeck ? "deck" : "field";
            this.container.setDepth(DEPTH.CARD_ON_DRAG);
        });

        this.container.on("drag", (pointer, dragX, dragY) => {
            this.container.x = dragX;
            this.container.y = dragY;
            this.container.setDepth(DEPTH.CARD_ON_DRAG);

            const worldX = pointer.worldX;
            const worldY = pointer.worldY;

            const field = this.scene.field;
            const { row, col } = field.getCellFromPosition(worldX, worldY);

            if (lastHighlightedCell) {
                field.clearHighlight(lastHighlightedCell.row, lastHighlightedCell.col);
                lastHighlightedCell = null;
            }

            // 셀이 유효한지 확인 후 강조
            if (row !== null && col !== null && !field.isCellOccupied(row, col)) {
                field.highlightCell(row, col);
                lastHighlightedCell = { row, col }; // 마지막으로 강조된 셀 기억
            }
        });

        this.container.on("dragend", (pointer, dragX, dragY) => {
            isDraggingCard = false;
            this.container.setDepth(DEPTH.CARD_ON_FIELD);

            const worldX = pointer.worldX;
            const worldY = pointer.worldY;

            const field = this.scene.field;
            const { row, col } = field.getCellFromPosition(worldX, worldY);

            // 드래그가 끝난 후 강조된 셀이 있으면 원래 상태로 복원
            if (lastHighlightedCell) {
                field.clearHighlight(lastHighlightedCell.row, lastHighlightedCell.col);
                lastHighlightedCell = null;
            }

            // Phase 4에서 Mendeleev 카드를 덱으로 이동하려는 시도에 대한 예외 early return
            if (this.cardType === "MendeleevCard" && gameManager.currentPhase === 4) {
                this.resetToDeck();
                return;
            }

            // 유효하지 않은 위치로의 이동일 때 early return
            if (row === null || col === null || field.isCellOccupied(row, col) || (field.isValidDropPosition && !field.isValidDropPosition(row, col))) {
                if (this.inDeck) this.resetToDeck(); // 덱으로부터의 이동이었을 때
                else this.revertToLastValidPosition(); // 필드로부터의 이동이었을 때
                return;
            }

            // 유효한 위치로의 이동일 때

            if (this.inDeck) this.moveToField();

            const { x: snappedX, y: snappedY } = field.getSnapPosition(row, col);
            field.updateCardPosition(this, row, col);
            this.updatePosition(snappedX, snappedY);

            // 이전 위치에서의 폴트 체크 업데이트
            if ((this.row || this.row === 0) && (this.col || this.col === 0)) this.checkFaults(this.row, this.col);

            // 현재 row 및 col 저장
            this.row = row;
            this.col = col;

            this.checkFaults(row, col);

            this.logCardMove(row, col);

            this.scene.handleCardDrop(this.isOnRightPosition);

            // 모든 업데이트/저장 완료 후 드래그 카드 정보 초기화
            Card.draggedCard = null;
            Card.startLocationType = null;
        });
    }

    updateIsOnRightPosition(isOnRightPosition = this.isOnRightPosition) {
        this.isOnRightPosition = isOnRightPosition;

        if (this.isOnRightPosition) {
            this.setDefaultBorder();
        } else {
            this.handleWrongPosition();
        }
    }

    logCardMove(newRow, newColumn) {
        const cardIdentifier = this.elementInfo ? this.elementInfo.number : "Mendeleev";
        LogManager.logCardMove(
            cardIdentifier, // 드래그 중인 카드
            Card.startLocationType, // 시작 위치 종류 (덱 or 필드)
            Card.startLocationType === "deck" ? null : { row: this.row, column: this.col }, // 덱에서 시작하면 좌표는 null
            "field", // 종료 위치 종류 (필드로 이동)
            { row: newRow, column: newColumn }, // 새로운 필드 위치 좌표
            this.isOnRightPosition // 올바른 이동 여부
        );
    }

    checkFaults(row, col) {
        if (gameManager.currentPhase === 4) {
            const onRightPeriod = this.elementInfo.period == row + 1;
            const onRightGroup = this.elementInfo.group == col + 1;

            this.isOnRightPosition = onRightPeriod && onRightGroup;
            this.updateIsOnRightPosition();
            return;
        }

        const field = this.scene.field;

        for (let checkRow = 0; checkRow <= 7; checkRow++) {
            const card = field.grid[checkRow][col];
            if (!card || card.cardType === "MendeleevCard") continue;
            const isValidOxidationValue = field.isValidOxidationValue(col, card.elementInfo.oxidationNumbersArray);

            let isValidWeightValue = true;

            for (let compareRow = 0; compareRow <= 7; compareRow++) {
                if (checkRow === compareRow) continue;

                const cardToCompare = field.grid[compareRow][col];
                if (!cardToCompare || cardToCompare.cardType === "MendeleevCard") continue;

                if (compareRow < checkRow) {
                    if (cardToCompare.elementInfo.weight >= card.elementInfo.weight) {
                        isValidWeightValue = false;
                        break;
                    }
                } else if (checkRow < compareRow && card.elementInfo.weight >= cardToCompare.elementInfo.weight) {
                    isValidWeightValue = false;
                    break;
                }
            }

            card.updateIsOnRightPosition(isValidOxidationValue && isValidWeightValue);
        }
    }
}

class MendeleevCard extends Card {
    constructor(cardStack, scene) {
        super(null, cardStack, scene);
        this.cardType = "MendeleevCard";

        this.createContainer();
        this.setDragEventListeners();
        if (this.cardStack) this.cardStack.addCard(this);
    }

    // Mendeleev 카드에 대한 고유 UI 생성
    createContainer() {
        super.createContainer();

        this.cardImage = this.scene.add.image(0, 0, "mendeleevCard"); // 이미지 추가 (미리 로드된 이미지 사용)
        this.cardImage.setDisplaySize(Card.width, Card.height); // 60x90 크기로 조정
        this.cardImage.setOrigin(0.5, 0.5);

        // 컨테이너에 모든 요소 추가
        this.container.addAt(this.cardImage, 0);

        // 상호작용 설정
        this.container.setSize(Card.width, Card.height);
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
    }

    // 멘델레예프 카드는 항상 올바른 배치로 간주됨
    checkFaults(row, col) {
        return true;
    }

    // 배치될 때마다 로그 기록 (isRightPosition을 true로 설정)
    logCardMove(newRow, newColumn) {
        LogManager.logCardMove(
            "Mendeleev", // 멘델레예프 카드는 이름 대신 "Mendeleev"로 기록
            Card.startLocationType,
            Card.startLocationType === "deck" ? null : { row: this.row, column: this.col },
            "field", // 필드에 배치됨
            { row: newRow, column: newColumn },
            true // 멘델레예프 카드는 항상 유효한 배치임
        );
    }

    // 멘델레예프 카드는 테두리 스타일 변경이 필요 없으므로 빈 메서드로 남겨둠
    handleWrongPosition() {}
    setDefaultBorder() {}
}

class GeneralCard extends Card {
    static backgroundColor = 0xffffff;

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

    // 카드의 컨테이너를 생성하고 필요한 그래픽 요소를 추가
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
