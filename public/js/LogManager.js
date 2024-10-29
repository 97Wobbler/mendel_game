class LogManager {
    static logBatch = [];
    static sessionId = LogManager.generateSessionId();
    static playerNickname = "";

    static generateSessionId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    static registerListeners() {
        document.addEventListener("cardMoved", (event) => {
            const { cardNumber, startLocationType, startLocation, endLocationType, endLocation, isCorrectMove } = event.detail;
            const logEntry = {
                timestamp: new Date().toISOString(),
                sessionId: LogManager.sessionId,
                nickname: LogManager.playerNickname,
                cardNumber,
                startLocationType,
                startLocation,
                endLocationType,
                endLocation,
                isCorrectMove,
            };
            LogManager.logBatch.push(logEntry);

            if (LogManager.logBatch.length >= 10) {
                LogManager.sendLogsToServer();
            }
        });

        document.addEventListener("gameEnded", () => {
            if (LogManager.logBatch.length > 0) {
                LogManager.sendLogsToServer();
            }
        });
    }

    // 서버로 로그 전송
    static sendLogsToServer() {
        fetch("/api/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(LogManager.logBatch),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Logs successfully sent:", data);
                LogManager.logBatch = []; // 전송 후 로그 배열 초기화
            })
            .catch((error) => console.error("Error sending logs:", error));
    }

    // 주기적으로 로그 전송
    static startLogBatchInterval() {
        setInterval(() => {
            if (LogManager.logBatch.length > 0) {
                LogManager.sendLogsToServer();
            }
        }, 5000); // 5초마다 한 번씩 서버로 전송
    }
}

// 주기적 로그 전송 시작
LogManager.startLogBatchInterval();
LogManager.registerListeners();
