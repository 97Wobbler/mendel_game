class FixedUI {
    static fixedUIWidth = 350;
    static characterHeight = 250;
    static deckColor = 0x807d65;

    constructor(scene) {
        this.scene = scene;

        this.updateOffset();
        this.createContainer();
        this.drawDeckBackground();

        this.mendeleevUI = new MendeleevUI(scene, this.container);
        this.elementCardStack = new CardStack(this.scene, this.elementCardStackOffsetX, this.elementCardStackOffsetY);
    }

    updateOffset() {
        this.offsetX = this.scene.scale.width - FixedUI.fixedUIWidth;
        this.offsetY = 0;
        this.deckHeight = this.scene.scale.height - FixedUI.characterHeight;
        this.elementCardStackOffsetX = this.offsetX + FixedUI.fixedUIWidth / 2 - Card.width / 2;
        this.elementCardStackOffsetY = this.scene.scale.height - Card.height - 100;
    }

    createContainer() {
        this.container = this.scene.add.container(this.offsetX, this.offsetY);
        this.container.setScrollFactor(0);
        this.container.setDepth(DEPTH.FIXED_UI);
    }

    drawDeckBackground() {
        const deckOffsetX = 0;
        const deckOffsetY = FixedUI.characterHeight;
        const deckWidth = FixedUI.fixedUIWidth;
        const deckHeight = this.deckHeight;

        this.deckRect = this.scene.add.rectangle(deckOffsetX, deckOffsetY, deckWidth, deckHeight, FixedUI.deckColor);
        this.deckRect.setOrigin(0, 0);

        this.container.add(this.deckRect);
    }

    resize() {
        this.updateOffset();
        this.container.setPosition(this.offsetX, this.offsetY);
        this.deckRect.setSize(FixedUI.fixedUIWidth, this.deckHeight);
        this.elementCardStack.updateCardsPosition(this.elementCardStackOffsetX, this.elementCardStackOffsetY);
    }
}
