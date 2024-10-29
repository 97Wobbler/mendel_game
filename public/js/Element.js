class Element {
    static elements = {};

    static getElementByNumber(number) {
        return Element.elements[number];
    }

    static loadElementsFromCSV(csvData) {
        const lines = csvData.split(/\r?\n/);

        // 첫 번째 행(헤더)을 제거
        lines.shift();

        lines.forEach((line) => {
            const [number, weight, symbol, name, oxidationNumbers, color, period, group] = line.split(",");

            // CSV에서 산화수는 문자열로 들어오기 때문에 배열로 변환
            const oxidationNumbersArray = oxidationNumbers.split(" ").map(Number);

            // Element 인스턴스 생성
            const element = new Element(
                Number(number),
                parseFloat(weight),
                symbol,
                name,
                oxidationNumbersArray,
                oxidationNumbers,
                String(color),
                period,
                group
            );

            // 원소 번호를 키로 해서 static elements에 저장
            Element.elements[element.number] = element;
        });
    }

    constructor(number, weight, symbol, name, oxidationNumbersArray, oxidationNumbers, color, period, group) {
        this.number = number; // 원자 번호
        this.weight = weight; // 원자량
        this.symbol = symbol; // 원소 기호
        this.name = name; // 원소 이름
        this.oxidationNumbersArray = oxidationNumbersArray; // 산화수 (배열로 저장)
        this.oxidationNumbers = modifyString(oxidationNumbers);
        this.color = hexToNumber(color);
        this.period = period;
        this.group = group;
    }
}

function hexToNumber(hex) {
    // #이 있는 경우 제거
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    }

    // 16진수 문자열을 숫자로 변환
    return parseInt(hex, 16);
}

function modifyString(inputString) {
    const parts = inputString.split(" ");

    const positive = [];
    const negative = [];

    parts.forEach((string) => {
        if (Number(string) > 0) positive.push(string);
        else negative.push(string);
    });

    return { positive: positive.join(" "), negative: negative.join(" ") };
}
