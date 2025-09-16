const display = document.getElementById("display");

// Adiciona valor ao display (tratando operadores duplicados)
function append(value) {
    if (display.value === "Erro") display.value = "";

    const lastChar = display.value.slice(-1);
    const operators = ["+", "-", "*", "/"];

    // permitir "-" como primeiro caractere (número negativo)
    if (operators.includes(value)) {
        if (!display.value) {
            if (value === "-") {
                display.value = "-";
            }
            return;
        }
        // substituir operador final por novo operador (evita ++, +*, etc.)
        if (operators.includes(lastChar)) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }

    display.value += value;
}

// Limpa o display
function clearDisplay() {
    display.value = "";
}

// Apaga o último caractere
function deleteLast() {
    if (display.value === "Erro") {
        display.value = "";
        return;
    }
    display.value = display.value.slice(0, -1);
}

// Calcula expressão (substitui × e ÷ caso use esses símbolos)
function calculate() {
    try {
        let exp = display.value.replace(/×/g, "*").replace(/÷/g, "/");

        // remover operadores finais (ex: "5+")
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

/*
  Função de porcentagem (comportamento típico de calculadora):
  - Se houver "valorEsquerdo operador valorDireito" (ex: 200+10), transforma 10% em (200 * 10 / 100)
    => 200 + 20 (o display fica "200+20" e aí = funciona normalmente)
  - Se houver apenas um número (ex: "50"), transforma em 0.5
*/
function percentage() {
    try {
        let exp = display.value;
        if (!exp) return;

        // não processar se terminar com operador
        if (/[+\-*/]$/.test(exp)) return;

        // regex: captura (parteEsquerda)(operador)(numeroFinal)
        const m = exp.match(/(.+?)([+\-*/])([0-9]*\.?[0-9]+)$/);

        if (m) {
            const leftExpr = m[1];       // pode ser uma expressão, ex: "1+2"
            const operator = m[2];       // + - * /
            const rightNum = parseFloat(m[3]);

            // avalia parte esquerda para obter base do %
            const safeLeft = leftExpr.replace(/×/g, "*").replace(/÷/g, "/");
            const leftVal = eval(safeLeft);

            if (isNaN(leftVal)) throw new Error("Erro");
            const percentValue = (leftVal * rightNum) / 100;

            // formata resultado para evitar muitas casas decimais
            const pvStr = Number.isInteger(percentValue)
                ? percentValue.toString()
                : parseFloat(percentValue.toPrecision(12)).toString();

            display.value = leftExpr + operator + pvStr;
        } else {
            // caso simples: apenas um número -> divide por 100
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
