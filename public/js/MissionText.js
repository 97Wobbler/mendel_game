class MissionText {
    constructor(scene, container, missionText) {
        this.scene = scene;
        this.container = container;
        this.condition = null;

        this.text = this.scene.add.text(0, 0, missionText, {
            font: "20px Arial",
            fill: "#000",
            padding: { x: 10, y: 10 },
            align: "center",
            wordWrap: { width: FixedUI.fixedUIWidth - 50 },
        });
        this.text.setDepth(DEPTH.SPEECH_BUBBLE);

        this.container.add(this.text);
    }

    handleVaildCondition() {
        this.setColor("#000000");
    }

    handleInvaildCondition() {
        this.setColor("#FF2040");
    }

    setText(text) {
        this.text.setText(text);
    }

    setPosition(x, y) {
        this.text.setPosition(x, y);
    }

    setColor(color) {
        this.text.setColor(color);
    }

    remove() {
        this.text.destroy();
    }
}
