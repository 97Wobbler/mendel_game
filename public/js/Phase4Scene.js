class Phase4Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Phase4Scene" });
        this.currentRowIndex = 0;
        this.uiPanelHeight = Card.height + 80;
    }

    preload() {
        this.load.text("elementData", "data/Elements.csv");
        this.load.image("mendeleevCard", "img/joker.png");
    }

    create() {
        const elementData = this.cache.text.get("elementData");
        Element.loadElementsFromCSV(elementData);

        /** 4단계 작업용 임시코드 TODO: 완성 후 삭제할 것 */

        // uiManager.showGameScreen();
        // gameManager.currentPhase = 4;
        // gameManager.cardPlacements = [
        //     [
        //         {
        //             row: 0,
        //             col: 0,
        //             elementNumber: 1,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 0,
        //             col: 1,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 2,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 3,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 4,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 5,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 6,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 0,
        //             col: 7,
        //             elementNumber: 2,
        //             cardType: "NobleCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 1,
        //             col: 0,
        //             elementNumber: 3,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 1,
        //             elementNumber: 4,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 2,
        //             elementNumber: 5,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 3,
        //             elementNumber: 6,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 4,
        //             elementNumber: 7,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 5,
        //             elementNumber: 8,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 6,
        //             elementNumber: 9,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 1,
        //             col: 7,
        //             elementNumber: 10,
        //             cardType: "NobleCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 2,
        //             col: 0,
        //             elementNumber: 11,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 1,
        //             elementNumber: 12,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 2,
        //             elementNumber: 13,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 3,
        //             elementNumber: 14,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 4,
        //             elementNumber: 15,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 5,
        //             elementNumber: 16,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 6,
        //             elementNumber: 17,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 2,
        //             col: 7,
        //             elementNumber: 18,
        //             cardType: "NobleCard",
        //         },
        //         {
        //             row: 2,
        //             col: 8,
        //             cardType: "MendeleevCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 3,
        //             col: 0,
        //             elementNumber: 19,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 1,
        //             elementNumber: 20,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 2,
        //             elementNumber: 21,
        //             cardType: "EkaCard",
        //         },
        //         {
        //             row: 3,
        //             col: 3,
        //             elementNumber: 22,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 4,
        //             elementNumber: 23,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 5,
        //             elementNumber: 24,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 6,
        //             elementNumber: 25,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 7,
        //             elementNumber: 26,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 8,
        //             elementNumber: 28,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 3,
        //             col: 9,
        //             elementNumber: 27,
        //             cardType: "GeneralCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 4,
        //             col: 0,
        //             elementNumber: 29,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 4,
        //             col: 1,
        //             elementNumber: 30,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 4,
        //             col: 2,
        //             elementNumber: 31,
        //             cardType: "EkaCard",
        //         },
        //         {
        //             row: 4,
        //             col: 3,
        //             elementNumber: 32,
        //             cardType: "EkaCard",
        //         },
        //         {
        //             row: 4,
        //             col: 4,
        //             elementNumber: 33,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 4,
        //             col: 5,
        //             elementNumber: 34,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 4,
        //             col: 6,
        //             elementNumber: 35,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 4,
        //             col: 7,
        //             elementNumber: 36,
        //             cardType: "NobleCard",
        //         },
        //         {
        //             row: 4,
        //             col: 8,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 4,
        //             col: 9,
        //             cardType: "MendeleevCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 5,
        //             col: 0,
        //             elementNumber: 37,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 1,
        //             elementNumber: 38,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 2,
        //             elementNumber: 39,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 3,
        //             elementNumber: 40,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 4,
        //             elementNumber: 41,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 5,
        //             elementNumber: 42,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 6,
        //             elementNumber: 43,
        //             cardType: "EkaCard",
        //         },
        //         {
        //             row: 5,
        //             col: 7,
        //             elementNumber: 45,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 8,
        //             elementNumber: 44,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 5,
        //             col: 9,
        //             elementNumber: 46,
        //             cardType: "GeneralCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 6,
        //             col: 0,
        //             elementNumber: 47,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 1,
        //             elementNumber: 48,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 2,
        //             elementNumber: 49,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 3,
        //             elementNumber: 50,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 4,
        //             elementNumber: 51,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 5,
        //             elementNumber: 52,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 6,
        //             elementNumber: 53,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 6,
        //             col: 7,
        //             elementNumber: 54,
        //             cardType: "NobleCard",
        //         },
        //         {
        //             row: 6,
        //             col: 8,
        //             cardType: "MendeleevCard",
        //         },
        //     ],
        //     [
        //         {
        //             row: 7,
        //             col: 0,
        //             elementNumber: 55,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 7,
        //             col: 1,
        //             elementNumber: 56,
        //             cardType: "GeneralCard",
        //         },
        //         {
        //             row: 7,
        //             col: 2,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 7,
        //             col: 3,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 7,
        //             col: 4,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 7,
        //             col: 5,
        //             cardType: "MendeleevCard",
        //         },
        //         {
        //             row: 7,
        //             col: 6,
        //             cardType: "MendeleevCard",
        //         },
        //     ],
        // ];

        /** 4단계 작업용 임시코드 */

        const offsetX = 50;
        const offsetY = 50;

        this.field = new Phase4Field(offsetX, offsetY, this);

        this.setCameraSetting(); // 필드 생성 후, 필드 크기에 맞게 카메라 세팅
        this.createFixedHeaders();
        this.createFixedUI(); // 고정 UI 생성 및 카드 배치

        this.cardStack = new Phase4CardStack(this, this.uiPanelOffsetX + 10, this.uiPanelOffsetY + 60, Card.width + 10, 0);

        uiManager.showPopup("Final Stage", "Complete the periodic table!", () => {
            this.loadNextRowCards(); // Proceed with the game logic
        });

        this.scale.on("resize", this.resizeUI, this);
    }

    update() {
        this.headerRowCells.x = -this.camera.scrollX;
        this.headerColumnCells.y = -this.camera.scrollY;
    }

    setCameraSetting() {
        const fieldWidth = this.field.columns * Field.gridWidth + 2 * this.field.offsetX;
        const fieldHeight = this.field.rows * Field.gridHeight + 2 * this.field.offsetY + this.uiPanelHeight;

        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, fieldWidth, fieldHeight);
        this.camera.setBackgroundColor("#D1CEB6");

        // 필드 드래그(스크롤)
        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown && !isDraggingCard) {
                this.camera.scrollX -= pointer.velocity.x / this.camera.zoom / 5;
                this.camera.scrollY -= pointer.velocity.y / this.camera.zoom / 5;
            }
        });
    }

    createFixedHeaders() {
        this.createFixedRow();
        this.createFixedColumn();

        const temporarySquare = this.add.rectangle(0, 0, this.field.offsetX, this.field.offsetY, 0xd1ceb6);
        temporarySquare.setOrigin(0, 0);
        temporarySquare.setScrollFactor(0);
        temporarySquare.setDepth(DEPTH.FIELD_FIXED_UI);
    }

    resizeUI() {
        this.uiPanelOffsetX = 0;
        this.uiPanelOffsetY = this.scale.height - this.uiPanelHeight;

        this.uiPanel.setPosition(this.uiPanelOffsetX, this.uiPanelOffsetY);
        this.uiPanel.setSize(this.scale.width, this.uiPanelHeight);

        this.cardStack.sortAndUpdateCardsPosition(this.uiPanelOffsetX + 10, this.uiPanelOffsetY + 60);

        if (this.headerRowBackground) this.headerRowBackground.setSize(this.scale.width, this.field.offsetX - 2);
        if (this.headerColumnBackground) this.headerColumnBackground.setSize(this.field.offsetY - 2, this.scale.height);
    }

    createFixedUI() {
        this.uiPanelOffsetX = 0;
        this.uiPanelOffsetY = this.scale.height - this.uiPanelHeight;

        // 고정된 하단 UI 패널 생성
        this.uiPanel = this.add.rectangle(this.uiPanelOffsetX, this.uiPanelOffsetY, this.scale.width, this.uiPanelHeight, 0x807d65);
        this.uiPanel.setOrigin(0, 0);
        this.uiPanel.setScrollFactor(0);
        this.uiPanel.setDepth(DEPTH.FIXED_UI);
    }

    createFixedRow() {
        const headerArea = this.add.container(this.field.offsetX, 0);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.scale.width;
        const backgroundRectHeight = this.field.offsetX - 2;

        this.headerRowBackground = this.add.rectangle(0, 0, backgroundRectWidth, backgroundRectHeight, 0xd1ceb6);
        this.headerRowBackground.setOrigin(0, 0);
        this.headerRowBackground.setScrollFactor(0);

        headerArea.add(this.headerRowBackground);

        this.headerRowCells = this.add.container(0, 0);

        const cellWidth = Field.gridWidth - 2;
        const cellHeight = 30;

        const cellOffsetX = 1;
        const cellOffsetY = backgroundRectHeight - cellHeight;

        const textOffsetX = cellOffsetX + cellWidth / 2;
        const textOffsetY = cellOffsetY + cellHeight / 2;

        const headerData = Array.from({ length: 18 }, (_, i) => i + 1);
        headerData.forEach((headerText, i) => {
            const headerCell = this.add.rectangle(cellOffsetX + i * Field.gridWidth, cellOffsetY, cellWidth, cellHeight, 0xffffff);
            headerCell.setOrigin(0, 0);
            headerCell.setAlpha(0.3);

            const headerCellText = this.add.text(textOffsetX + i * Field.gridWidth, textOffsetY, headerText, {
                font: "16px Arial",
                fill: "#807d65",
            });
            headerCellText.setOrigin(0.5, 0.5); // 텍스트를 셀 중앙에 배치

            this.headerRowCells.add(headerCell);
            this.headerRowCells.add(headerCellText);
        });

        headerArea.add(this.headerRowCells);
    }

    createFixedColumn() {
        const headerArea = this.add.container(0, this.field.offsetY);
        headerArea.setScrollFactor(0);
        headerArea.setDepth(DEPTH.FIELD_FIXED_UI);

        const backgroundRectWidth = this.field.offsetY - 2;
        const backgroundRectHeight = this.scale.height;

        this.headerColumnBackground = this.add.rectangle(0, 0, backgroundRectWidth, backgroundRectHeight, 0xd1ceb6);
        this.headerColumnBackground.setOrigin(0, 0);
        this.headerColumnBackground.setScrollFactor(0); // 스크롤에 영향을 받지 않도록 고정

        headerArea.add(this.headerColumnBackground);

        this.headerColumnCells = this.add.container(0, 0);

        const cellWidth = 30;
        const cellHeight = Field.gridHeight - 2;

        const cellOffsetX = backgroundRectWidth - cellWidth;
        const cellOffsetY = 1;

        const textOffsetX = cellOffsetX + cellWidth / 2;
        const textOffsetY = cellOffsetY + cellHeight / 2;

        const periodData = Array.from({ length: 6 }, (_, i) => i + 1);
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

    handleCardDrop() {
        if (this.cardStack.isRowEmpty()) {
            if (this.currentRowIndex > 7) {
                gameManager.endGame();
            } else {
                this.loadNextRowCards();
            }
        }
    }

    loadNextRowCards() {
        const nextRowCards = gameManager.getRowCards(this.currentRowIndex);
        nextRowCards.forEach(({ row, col, elementNumber, cardType }) => {
            switch (cardType) {
                case "MendeleevCard": {
                    new MendeleevCard(this.cardStack, this);
                    break;
                }
                case "GeneralCard": {
                    new GeneralCard(Element.getElementByNumber(elementNumber), this.cardStack, this);
                    break;
                }
                case "NobleCard": {
                    new NobleCard(Element.getElementByNumber(elementNumber), this.cardStack, this);
                    break;
                }
                case "EkaCard": {
                    new EkaCard(Element.getElementByNumber(elementNumber), this.cardStack, this);
                    break;
                }
            }
        });

        this.currentRowIndex++;
    }
}
