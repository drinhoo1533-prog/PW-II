
const formulario = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");

const cep = document.getElementById("cep");
const telefone = document.getElementById("telefone");

// Formata o CEP: 00000-000
cep.addEventListener("input", function () {
    let valor = cep.value.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 5) {
        valor = valor.slice(0, 5) + "-" + valor.slice(5);
    }

    cep.value = valor;
});

// Formata o telefone enquanto o usuário digita.
telefone.addEventListener("input", function () {
    let valor = telefone.value.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    } else if (valor.length > 6) {
        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    telefone.value = valor;
});

// Validação do formulário.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        idade: Number(document.getElementById("idade").value),
        email: document.getElementById("email").value.trim(),
        cep: cep.value.trim(),
        estado: document.getElementById("estado").value,
        cidade: document.getElementById("cidade").value.trim(),
        regiao: document.getElementById("regiao").value,
        bairro: document.getElementById("bairro").value.trim(),
        marcas: document.getElementById("marcas").value.trim(),
        categoria: document.getElementById("categoria").value,
        hobby: document.getElementById("hobby").value.trim()
    };

    mensagem.textContent = "";
    mensagem.className = "";

    if (
        !dados.nome ||
        !dados.email ||
        !dados.estado ||
        !dados.cidade ||
        !dados.regiao ||
        !dados.marcas ||
        !dados.categoria
    ) {
        mostrarMensagem(
            "Confira os campos obrigatórios antes de continuar.",
            "erro"
        );
        return;
    }

    if (
        !Number.isInteger(dados.idade) ||
        dados.idade < 1 ||
        dados.idade > 120
    ) {
        mostrarMensagem("Digite uma idade válida.", "erro");
        return;
    }

    if (dados.cep && !/^\d{5}-?\d{3}$/.test(dados.cep)) {
        mostrarMensagem("Digite um CEP válido.", "erro");
        cep.focus();
        return;
    }

    if (!document.getElementById("autorizacao").checked) {
        mostrarMensagem(
            "Marque a autorização para continuar.",
            "erro"
        );
        return;
    }

    mostrarMensagem(
        `Cadastro preenchido com sucesso! Obrigado, ${dados.nome}.`,
        "sucesso"
    );

    // Demonstração escolar: não envia nem armazena os dados.
    console.log("Cadastro de demonstração concluído.");

    formulario.reset();
});

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}
