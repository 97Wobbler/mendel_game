class CardStack {
    constructor(scene, positionX, positionY, offsetX = 0, offsetY = -2) {
        this.scene = scene;
        this.positionX = positionX;
        this.positionY = positionY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.cards = [];
    }

    // 스택에 카드 추가
    addCard(card) {
        this.cards.push(card);
        this.sortAndUpdateCardsPosition();
    }

    // 스택에서 카드 제거
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index === -1) return;

        this.cards.splice(index, 1);
        this.sortAndUpdateCardsPosition();
    }

    // 스택이 비었는지 확인
    isEmpty() {
        return this.cards.length === 0;
    }

    getCardCount() {
        return this.cards.length;
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
            const cardX = this.positionX + i * this.offsetX;
            const cardY = this.positionY + i * this.offsetY;

            card.setInitialPosition(cardX, cardY);
            card.setPosition(cardX, cardY);
            this.scene.children.bringToTop(card.container);
        }
    }

    // 스택의 카드 위치 업데이트
    sortAndUpdateCardsPosition() {
        this.sortCards();
        this.updateCardsPosition();
    }
}

class MendeleevCardStack extends CardStack {
    static cardSpacing = 2;

    constructor(scene, positionX, positionY, offsetX, offsetY) {
        super(scene, positionX, positionY, offsetX, offsetY);
    }

    // 스택의 카드 위치 업데이트
    sortAndUpdateCardsPosition(positionX = this.positionX, positionY = this.positionY) {
        this.positionX = positionX;
        this.positionY = positionY;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const cardX = this.positionX + i * this.offsetX;
            const cardY = this.positionY + i * this.offsetY;

            card.setInitialPosition(cardX, cardY); // TODO: setInitialPosition가 여기서만 호출된다면, 메서드 안에 setPosition 호출을 편입해도 될듯
            card.setPosition(cardX, cardY);
            this.scene.children.bringToTop(card.container);
        }
    }
}

class Phase4CardStack extends CardStack {
    constructor(scene, positionX, positionY, offsetX, offsetY) {
        super(scene, positionX, positionY, offsetX, offsetY);
    }

    sortAndUpdateCardsPosition(positionX = this.positionX, positionY = this.positionY) {
        this.positionX = positionX;
        this.positionY = positionY;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const cardX = this.positionX + i * this.offsetX;
            const cardY = this.positionY + i * this.offsetY;

            card.setInitialPosition(cardX, cardY); // TODO: setInitialPosition가 여기서만 호출된다면, 메서드 안에 setPosition 호출을 편입해도 될듯
            card.setPosition(cardX, cardY);
            this.scene.children.bringToTop(card.container);
        }
    }

    // 모든 원소 카드가 필드로 이동했는지 체크하고 MendeelvCard를 삭제, 이후 true를 반환
    isRowEmpty() {
        const mendeleevCards = this.cards.filter((card) => {
            return card.cardType === "MendeleevCard";
        });

        const mendeleevCardCount = mendeleevCards.length;

        if (this.cards.length - mendeleevCardCount <= 0) {
            for (const card of mendeleevCards) card.destroyCard();
            return true;
        }
    }

    // 스택에서 카드 제거
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }
}
