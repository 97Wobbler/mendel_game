class UIManager {
    constructor() {
        this.startScreen = document.getElementById("start-screen");
        this.endScreen = document.getElementById("end-screen");
        this.stagePopup = document.getElementById("stagePopup");
        this.gameContainer = document.getElementById("game-container");
        this.stagePopupOverlay = document.getElementById("stagePopupOverlay");
        this.overlayTitle = document.getElementById("overlayTitle");
        this.slideContainer = document.getElementById("slideContainer");
        this.slideImage = document.getElementById("slideImage");
        this.slideText = document.getElementById("slideText");
        this.nextSlideButton = document.getElementById("nextSlideButton");
        this.confirmButton = document.getElementById("confirmButton");
        this.prevSlideButton = document.getElementById("prevSlideButton");
        this.slides = [];
        this.currentSlideIndex = 0;

        this.nextSlideButton.onclick = () => this.showNextSlide();
        this.confirmButton.onclick = () => this.hideOverlay();
        this.prevSlideButton.onclick = () => this.showPrevSlide();
    }

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

    showOverlay(title, slides, callback) {
        this.overlayTitle.innerText = title;
        this.slides = slides;
        this.currentSlideIndex = 0;
        this.overlayCallback = callback;
        this.updateSlideContent();
        this.confirmButton.classList.add("hidden");
        this.prevSlideButton.classList.add("hidden");
        this.stagePopupOverlay.classList.remove("hidden");
    }

    hideOverlay() {
        this.stagePopupOverlay.classList.add("hidden");
        if (this.overlayCallback) this.overlayCallback(); // 콜백 실행
        this.overlayCallback = null; // 콜백 초기화
    }

    showNextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.currentSlideIndex++;
            this.updateSlideContent();
        }

        this.prevSlideButton.classList.remove("hidden"); // 첫 슬라이드를 지나면 "이전" 버튼 표시
        if (this.currentSlideIndex === this.slides.length - 1) {
            this.nextSlideButton.classList.add("hidden");
            this.confirmButton.classList.remove("hidden");
        } else {
            this.nextSlideButton.classList.remove("hidden");
            this.confirmButton.classList.add("hidden");
        }
    }

    showPrevSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.updateSlideContent();
        }

        // 첫 슬라이드에 도달했을 때 "이전" 버튼 숨기기
        if (this.currentSlideIndex === 0) {
            this.prevSlideButton.classList.add("hidden");
        } else {
            this.prevSlideButton.classList.remove("hidden");
        }

        this.nextSlideButton.classList.remove("hidden");
        this.confirmButton.classList.add("hidden"); // 마지막 슬라이드가 아니므로 "시작" 버튼 숨김
    }

    updateSlideContent() {
        const slide = this.slides[this.currentSlideIndex];
        this.slideImage.src = slide.image;
        this.slideText.innerHTML = slide.text;
        this.nextSlideButton.classList.toggle("hidden", this.currentSlideIndex >= this.slides.length - 1);
        this.prevSlideButton.classList.toggle("hidden", this.currentSlideIndex === 0); // 첫 슬라이드에서 숨김 처리
    }
}
