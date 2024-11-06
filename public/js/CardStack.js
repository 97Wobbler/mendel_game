class CardStack {
    constructor(scene, positionX, positionY, offsetX = 0, offsetY = -2) {
        this.scene = scene;
        this.positionX = positionX;
        this.positionY = positionY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.cards = [];

        this.setCounterText();
        this.allCardsCount = 0;
    }

    setCounterText() {
        this.counterText = "";

        const x = this.positionX + Card.width / 2;
        const y = this.positionY + Card.height + 20;

        this.counterTextObject = this.scene.add.text(x, y, this.counterText, {
            font: "bold 20px Arial",
            fill: "#E8E5D0",
        });
        this.counterTextObject.setOrigin(0.5, 0);
        this.counterTextObject.setDepth(DEPTH.SPEECH_BUBBLE);
        this.counterTextObject.setScrollFactor(0);
    }

    updateCounterText() {
        this.counterText = `${this.cards.length} / ${this.allCardsCount}`;
        this.counterTextObject.setText(this.counterText);
    }

    setAllCardsCount(number) {
        this.allCardsCount = number;
        this.updateCounterText();
    }

    // 스택에 카드 추가
    addCard(card) {
        this.cards.push(card);
    }

    // 스택에서 카드 제거
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index === -1) return;

        this.cards.splice(index, 1);
    }

    // 스택이 비었는지 확인
    isEmpty() {
        return this.cards.length === 0;
    }

    sortAndUpdateCardsPosition() {
        this.sortCards();
        this.updateCardsPosition();
    }

    sortCards() {
        this.cards.sort((a, b) => {
            return b.elementInfo.weight - a.elementInfo.weight;
        });
    }

    updateCardsPosition(positionX = this.positionX, positionY = this.positionY) {
        this.positionX = positionX;
        this.positionY = positionY;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            card.setPositionBasedOnStackIndex(i);
            this.scene.children.bringToTop(card.container);
        }

        const x = this.positionX + Card.width / 2;
        const y = this.positionY + Card.height + 20;

        this.counterTextObject.setPosition(x, y);
    }
}
