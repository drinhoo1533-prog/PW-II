let valorAtual = "";
let valorAnterior = "";
let operadorAtual = "";

// Elementos da tela
const resultado = document.getElementById("resultado");
const operacaoTela = document.getElementById("operacao");

// Adiciona números
function numero(valor) {

    // Impede dois pontos
    if (valor === "." && valorAtual.includes(".")) {
        return;
    }

    // Evita começar com vários zeros
    if (valorAtual === "0" && valor !== ".") {
        valorAtual = "";
    }

    valorAtual += valor;

    atualizarTela();
}

// Escolhe a operação
function operacao(operador) {

    if (valorAtual === "" && valorAnterior === "") {
        return;
    }

    if (valorAnterior !== "" && valorAtual !== "") {
        calcular();
    }

    if (valorAtual !== "") {
        valorAnterior = valorAtual;
        valorAtual = "";
    }

    operadorAtual = operador;

    operacaoTela.textContent =
        `${formatarNumero(valorAnterior)} ${mostrarOperador(operadorAtual)}`;
}

// Calcula o resultado
function calcular() {

    if (
        valorAnterior === "" ||
        valorAtual === "" ||
        operadorAtual === ""
    ) {
        return;
    }

    const numero1 = parseFloat(valorAnterior);
    const numero2 = parseFloat(valorAtual);

    let resultadoFinal;

    switch (operadorAtual) {

        case "+":
            resultadoFinal = numero1 + numero2;
            break;

        case "-":
            resultadoFinal = numero1 - numero2;
            break;

        case "*":
            resultadoFinal = numero1 * numero2;
            break;

        case "/":

            if (numero2 === 0) {
                resultado.textContent = "Erro";
                limparVariaveis();
                return;
            }

            resultadoFinal = numero1 / numero2;
            break;
    }

    resultadoFinal = arredondar(resultadoFinal);

    operacaoTela.textContent =
        `${formatarNumero(numero1)} ${mostrarOperador(operadorAtual)} ${formatarNumero(numero2)} =`;

    valorAtual = resultadoFinal.toString();

    valorAnterior = "";
    operadorAtual = "";

    resultado.textContent = formatarNumero(resultadoFinal);
}

// Limpa tudo
function limpar() {

    valorAtual = "";
    valorAnterior = "";
    operadorAtual = "";

    resultado.textContent = "0";
    operacaoTela.textContent = "0";
}

// Apaga o último número
function apagar() {

    if (valorAtual !== "") {
        valorAtual = valorAtual.slice(0, -1);
    }

    atualizarTela();
}

// Porcentagem
function porcentagem() {

    if (valorAtual !== "") {

        valorAtual =
            (parseFloat(valorAtual) / 100).toString();

        atualizarTela();
    }
}

// Atualiza o visor
function atualizarTela() {

    resultado.textContent =
        valorAtual === ""
            ? "0"
            : formatarNumero(valorAtual);
}

// Mostra símbolos bonitos
function mostrarOperador(operador) {

    const simbolos = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return simbolos[operador] || operador;
}

// Formata números
function formatarNumero(numero) {

    if (numero === "") {
        return "0";
    }

    const valor = Number(numero);

    if (Number.isNaN(valor)) {
        return numero;
    }

    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 10
    }).format(valor);
}

// Evita números com muitas casas decimais
function arredondar(numero) {

    return Math.round((numero + Number.EPSILON) * 10000000000) / 10000000000;
}

// Limpa variáveis
function limparVariaveis() {

    valorAtual = "";
    valorAnterior = "";
    operadorAtual = "";
}


// ============================
// TECLADO DO COMPUTADOR
// ============================

document.addEventListener("keydown", function(event) {

    const tecla = event.key;

    // Números
    if (/[0-9]/.test(tecla)) {
        numero(tecla);
    }

    // Decimal
    else if (tecla === "." || tecla === ",") {
        numero(".");
    }

    // Operações
    else if (
        tecla === "+" ||
        tecla === "-" ||
        tecla === "*" ||
        tecla === "/"
    ) {
        operacao(tecla);
    }

    // Enter
    else if (tecla === "Enter" || tecla === "=") {
        calcular();
    }

    // Backspace
    else if (tecla === "Backspace") {
        apagar();
    }

    // Escape
    else if (tecla === "Escape") {
        limpar();
    }

    // Porcentagem
    else if (tecla === "%") {
        porcentagem();
    }

});