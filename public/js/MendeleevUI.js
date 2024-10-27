class MendeleevUI {
    constructor(scene, container) {
        this.scene = scene;
        this.prevTimer = null;

        const positionX = scene.scale.width - scene.characterWidth / 2;
        const positionY = scene.characterHeight;

        // 멘델레예프 캐릭터 이미지
        this.characterSprite = scene.add.image(positionX, positionY, "mendeleevNormal").setScrollFactor(0);
        this.characterSprite.setDisplaySize(scene.characterWidth, scene.characterHeight); // 크기 조정
        this.characterSprite.setDepth(DEPTH.FIXED_UI);
        this.characterSprite.setOrigin(0.5, 1);

        // 말풍선을 위한 그래픽 (직사각형 + 삼각형)
        this.speechBubbleGraphics = scene.add.graphics({ fillStyle: { color: 0xf8f5e8 } }); // 말풍선 배경색 설정
        this.speechBubbleGraphics.setScrollFactor(0).setDepth(DEPTH.SPEECH_BUBBLE);

        // 텍스트
        this.speechBubbleText = scene.add
            .text(positionX, positionY + 50, "", {
                font: "20px Arial",
                fill: "#000",
                padding: { x: 10, y: 10 },
                align: "center",
                wordWrap: { width: 200 }, // 말풍선 너비에 맞게 줄바꿈
            })
            .setScrollFactor(0)
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        this.speechBubbleText.setDepth(DEPTH.SPEECH_BUBBLE);

        // 메시지 템플릿
        this.correctMessages = ["Good job!", "That's correct!"];
        this.wrongMessages = ["Something's WRONG!", "Try again!", "Hmm, check again!"];
        this.neutralMessages = ["Let's place the cards!", "Keep going!"];
    }

    updatePosition() {
        const positionX = this.scene.scale.width - this.scene.characterWidth / 2;
        const positionY = this.scene.characterHeight;

        this.characterSprite.setPosition(positionX, positionY);
        this.speechBubbleText.setPosition(positionX, positionY + 50);

        this.drawSpeechBubble(positionX, positionY + 50);
        if (this.speechBubbleText.text.trim() === "") {
            this.speechBubbleGraphics.setVisible(false);
        }
    }

    // 피드백 메시지와 캐릭터 상태를 업데이트
    showFeedback(messageType = "neutral") {
        let message;

        if (messageType === "correct") {
            message = this.getRandomMessage(this.correctMessages);
            this.characterSprite.setTexture("mendeleevThumbsUp"); // 맞았을 때의 새 이미지로 전환
        } else if (messageType === "wrong") {
            message = this.getRandomMessage(this.wrongMessages);
            this.characterSprite.setTexture("mendeleevConfused"); // 틀렸을 때의 이미지로 전환
        } else {
            message = this.getRandomMessage(this.neutralMessages);
            this.characterSprite.setTexture("mendeleevNormal"); // 기본 상태 이미지로 복귀
        }

        if (this.prevTimer) {
            this.prevTimer.remove(false); // 기존 타이머 취소
        }

        this.speechBubbleText.setText(message).setVisible(true);
        this.speechBubbleGraphics.setVisible(true);

        this.drawSpeechBubble(this.speechBubbleText.x, this.speechBubbleText.y);

        this.prevTimer = this.scene.time.delayedCall(2000, () => {
            this.speechBubbleText.setVisible(false);
            this.speechBubbleGraphics.setVisible(false);
            this.characterSprite.setTexture("mendeleevNormal");
        });
    }

    drawSpeechBubble(x, y) {
        const bubbleWidth = 220; // 말풍선의 너비
        const bubbleHeight = 80; // 말풍선의 높이
        const triangleHeight = 15; // 말풍선 삼각형의 높이

        this.speechBubbleGraphics.clear();

        // 말풍선 사각형 그리기
        this.speechBubbleGraphics.fillStyle(0xf8f5e8, 1); // 배경색
        this.speechBubbleGraphics.fillRoundedRect(x - bubbleWidth / 2, y - bubbleHeight / 2, bubbleWidth, bubbleHeight, 10);

        // 말풍선 아래 삼각형 그리기
        this.speechBubbleGraphics.fillTriangle(
            x,
            y - bubbleHeight / 2 - triangleHeight, // 삼각형 꼭짓점 (말풍선 하단 중앙)
            x - triangleHeight,
            y - bubbleHeight / 2, // 삼각형 왼쪽 밑
            x + triangleHeight,
            y - bubbleHeight / 2 // 삼각형 오른쪽 밑
        );
    }

    getRandomMessage(messageArray) {
        const randomIndex = Math.floor(Math.random() * messageArray.length);
        return messageArray[randomIndex];
    }

    showStageFeedback(stageNumber) {
        const stageMessages = {
            1: "Stage 1: Place the elements in their correct positions.",
            2: "Stage 2: Follow the new oxidation rules.",
            3: "Stage 3: Remember the trends in the periodic table.",
            4: "Final Stage: Complete the table!",
        };

        const message = stageMessages[stageNumber] || "Keep going!";
        this.speechBubbleText.setText(message).setVisible(true);
        this.speechBubbleGraphics.setVisible(true);

        this.drawSpeechBubble(this.speechBubbleText.x, this.speechBubbleText.y);

        if (this.prevTimer) {
            this.prevTimer.remove(false);
        }

        this.prevTimer = this.scene.time.delayedCall(3000, () => {
            this.speechBubbleText.setVisible(false);
            this.speechBubbleGraphics.setVisible(false);
            this.characterSprite.setTexture("mendeleevNormal");
        });
    }
}
