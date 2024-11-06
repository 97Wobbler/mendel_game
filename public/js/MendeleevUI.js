class MendeleevUI {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;

        this.prevTimer = null;

        this.characterSprite = scene.add.image(0, 0, "mendeleevNormal").setScrollFactor(0);
        this.characterSprite.setDisplaySize(FixedUI.fixedUIWidth, FixedUI.characterHeight); // 크기 조정
        this.characterSprite.setOrigin(0, 0);

        this.speechBubbleGraphics = scene.add.graphics();
        this.speechBubbleGraphics.setScrollFactor(0).setDepth(DEPTH.SPEECH_BUBBLE);

        this.speechBubbleText = scene.add
            .text(FixedUI.fixedUIWidth / 2, FixedUI.characterHeight, "", {
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

        this.container.add([this.characterSprite, this.speechBubbleGraphics, this.speechBubbleText]);
    }

    updatePosition() {
        const positionX = this.scene.scale.width - FixedUI.fixedUIWidth / 2;
        const positionY = FixedUI.characterHeight;

        this.characterSprite.setPosition(positionX, positionY);
        this.speechBubbleText.setPosition(positionX, positionY + 50);

        this.drawSpeechBubble(positionX, positionY + 50);
        if (this.speechBubbleText.text.trim() === "") {
            this.speechBubbleGraphics.setVisible(false);
        }
    }

    // 피드백 메시지와 캐릭터 상태를 업데이트
    showFeedback(message, messageType = "neutral") {
        if (messageType === "correct") {
            this.characterSprite.setTexture("mendeleevThumbsUp"); // 맞았을 때의 새 이미지로 전환
        } else if (messageType === "wrong") {
            this.characterSprite.setTexture("mendeleevConfused"); // 틀렸을 때의 이미지로 전환
        } else {
            this.characterSprite.setTexture("mendeleevNormal"); // 기본 상태 이미지로 복귀
        }

        if (this.prevTimer) this.prevTimer.remove(false);

        this.speechBubbleText.setText(message).setVisible(true);
        this.speechBubbleGraphics.setVisible(true);

        this.drawSpeechBubble(this.speechBubbleText.x, this.speechBubbleText.y);

        this.prevTimer = this.scene.time.delayedCall(2000, () => {
            this.speechBubbleText.setVisible(false);
            this.speechBubbleGraphics.setVisible(false);
            this.characterSprite.setTexture("mendeleevNormal");
        });
    }

    onGameEnd() {
        this.characterSprite.setTexture("mendeleevThumbsUp");

        if (this.prevTimer) this.prevTimer.remove(false);

        this.speechBubbleText.setText("All Missions Cleared!").setVisible(true);
        this.speechBubbleGraphics.setVisible(true);

        this.drawSpeechBubble(this.speechBubbleText.x, this.speechBubbleText.y);
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

    say(message) {
        this.speechBubbleText.setText(message).setVisible(true);
        this.speechBubbleGraphics.setVisible(true);

        this.drawSpeechBubble(this.speechBubbleText.x, this.speechBubbleText.y);

        if (this.prevTimer) this.prevTimer.remove(false);

        this.prevTimer = this.scene.time.delayedCall(3000, () => {
            this.speechBubbleText.setVisible(false);
            this.speechBubbleGraphics.setVisible(false);
            this.characterSprite.setTexture("mendeleevNormal");
        });
    }
}
