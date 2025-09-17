const display = document.getElementById("display");

function append(value) {
    if (display.value === "Erro") display.value = "";

    const lastChar = display.value.slice(-1);
    const operators = ["+", "-", "*", "/"];

    if (operators.includes(value)) {
        if (!display.value) {
            if (value === "-") {
                display.value = "-";
            }
            return;
        }

        if (operators.includes(lastChar)) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }

    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    if (display.value === "Erro") {
        display.value = "";
        return;
    }
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let exp = display.value.replace(/×/g, "*").replace(/÷/g, "/");

        exp = exp.replace(/[+\-*/]+$/, "");
        if (!exp) return;

        const result = eval(exp);
        if (!Number.isFinite(result)) throw new Error("Erro");

        display.value = Number.isInteger(result)
            ? result.toString()
            : parseFloat(result.toPrecision(12)).toString();
    } catch (e) {
        display.value = "Erro";
    }
}

function percentage() {
    try {
        let exp = display.value;
        if (!exp) return;

        if (/[+\-*/]$/.test(exp)) return;

        const m = exp.match(/(.+?)([+\-*/])([0-9]*\.?[0-9]+)$/);

        if (m) {
            const leftExpr = m[1];
            const operator = m[2];     
            const rightNum = parseFloat(m[3]);

            const safeLeft = leftExpr.replace(/×/g, "*").replace(/÷/g, "/");
            const leftVal = eval(safeLeft);

            if (isNaN(leftVal)) throw new Error("Erro");
            const percentValue = (leftVal * rightNum) / 100;

            const pvStr = Number.isInteger(percentValue)
                ? percentValue.toString()
                : parseFloat(percentValue.toPrecision(12)).toString();

            display.value = leftExpr + operator + pvStr;
        } else {

            const num = parseFloat(exp.replace(/×/g, "*").replace(/÷/g, "/"));
            if (isNaN(num)) return;
            const res = num / 100;
            display.value = Number.isInteger(res)
                ? res.toString()
                : parseFloat(res.toPrecision(12)).toString();
        }
    } catch (e) {
        display.value = "Erro";
    }
}
