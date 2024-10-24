class UIManager {
    constructor() {
        this.startScreen = document.getElementById("start-screen");
        this.endScreen = document.getElementById("end-screen");
        this.stagePopup = document.getElementById("stagePopup");
        this.gameContainer = document.getElementById("game-container");
    }

    // 팝업 표시
    showPopup(title, message, callback) {
        document.getElementById("popupTitle").innerText = title;
        document.getElementById("popupMessage").innerText = message;
        this.stagePopup.classList.remove("hidden");

        document.getElementById("popupButton").onclick = () => {
            this.stagePopup.classList.add("hidden");
            if (callback) callback();
        };
    }

    // 게임 화면과 시작/종료 화면 전환
    showStartScreen() {
        this.startScreen.style.display = "flex";
        this.endScreen.style.display = "none";
    }

    showGameScreen() {
        this.startScreen.style.display = "none";

        // 게임 시작 시, 게임 컨테이너를 보이게 함
        this.gameContainer.style.position = "static"; // position 초기화
        this.gameContainer.style.opacity = "1"; // opacity를 1로 설정하여 보이게 함
    }

    showEndScreen(finalScore) {
        this.startScreen.style.display = "none";
        this.endScreen.style.display = "flex";
        this.gameContainer.style.display = "none";
        document.getElementById("final-score").textContent = `Your Score: ${finalScore}`;
    }
}
