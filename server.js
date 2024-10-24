const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));

// 로그 유효성 검사 함수
function validateLog(log) {
    const requiredFields = [
        "timestamp",
        "sessionId",
        "nickname",
        "phase",
        "cardNumber",
        "startLocationType",
        "startLocation",
        "endLocationType",
        "endLocation",
        "isCorrectMove"
    ];

    for (const field of requiredFields) {
        if (!log.hasOwnProperty(field)) {
            return `Missing field: ${field}`;
        }
    }

    return null;  // 유효성 검사가 통과되었을 때 null 반환
}

app.post("/log", (req, res) => {
    const logs = req.body;

    // 각 로그에 대한 유효성 검사
    for (const log of logs) {
        const validationError = validateLog(log);
        if (validationError) {
            console.error(`Log validation failed: ${validationError}`);
            return res.status(400).send(`Invalid log data: ${validationError}`);
        }
    }

    // 유효성 검사가 통과되었을 때만 로그 저장
    const logString = logs.map((log) => JSON.stringify(log)).join("\n");

    fs.appendFile("logs.txt", logString + "\n", (err) => {
        if (err) {
            console.error("Error writing logs: ", err);
            return res.status(500).send("Failed to save logs");
        }
        console.log("Logs saved to logs.txt");
        res.status(200).send("Logs saved successfully");
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
