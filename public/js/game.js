const config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 600,
    parent: "game-container",
    scene: [],
};

const DEPTH = {
    DEFAULT: 0,
    CARD_ON_FIELD: 1,
    FIELD_FIXED_UI: 2,
    FIXED_UI: 3,
    CARD_ON_DECK: 4,
    CARD_ON_DRAG: 5,
    SPEECH_BUBBLE: 6,
};

const game = new Phaser.Game(config);

const uiManager = new UIManager();

// 시작 버튼 클릭 시 게임 시작
document.getElementById("start-button").addEventListener("click", function () {
    const playerName = document.getElementById("player-name-input").value;
    if (playerName) {
        LogManager.playerNickname = playerName;
        uiManager.showGameScreen();
        game.scene.add("GameStageManager", GameStageManager, true);
    } else {
        alert("Please enter your name to start the game.");
    }
});

window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth - 10, window.innerHeight - 10);
});
