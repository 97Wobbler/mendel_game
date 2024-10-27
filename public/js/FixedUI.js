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
    }

    updateOffset() {
        this.offsetX = this.scene.scale.width - FixedUI.fixedUIWidth;
        this.offsetY = 0;
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
        const deckHeight = this.scene.scale.height - FixedUI.characterHeight;

        const deckRect = this.scene.add.rectangle(deckOffsetX, deckOffsetY, deckWidth, deckHeight, FixedUI.deckColor);
        deckRect.setOrigin(0, 0);

        this.container.add(deckRect);
    }
}
