// ==========================================
// LA BELLA PIZZA
// Sistema do carrinho
// ==========================================

let carrinho = [];


// ==========================================
// ADICIONAR PRODUTO
// ==========================================

function adicionarCarrinho(nome, preco) {

    const produtoExistente = carrinho.find(
        item => item.nome === nome
    );

    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    atualizarCarrinho();

    abrirCarrinho();
}


// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(nome) {

    carrinho = carrinho.filter(
        item => item.nome !== nome
    );

    atualizarCarrinho();
}


// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {

    const container = document.getElementById("itensCarrinho");
    const contador = document.getElementById("contador");
    const totalElemento = document.getElementById("total");

    container.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;


    if (carrinho.length === 0) {

        container.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

    }


    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;

        quantidadeTotal += item.quantidade;


        const elemento = document.createElement("div");

        elemento.className = "item-carrinho";

        elemento.innerHTML = `
            <div>
                <h4>${item.nome}</h4>

                <small>
                    ${item.quantidade}x
                    R$ ${item.preco.toFixed(2).replace(".", ",")}
                </small>
            </div>

            <strong>
                R$ ${subtotal.toFixed(2).replace(".", ",")}
            </strong>

            <button
                class="remover"
                onclick="removerProduto('${item.nome}')"
            >
                ×
            </button>
        `;

        container.appendChild(elemento);

    });


    contador.textContent = quantidadeTotal;


    totalElemento.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;
}


// ==========================================
// ABRIR CARRINHO
// ==========================================

function abrirCarrinho() {

    document
        .getElementById("carrinho")
        .classList.add("aberto");

    document
        .getElementById("overlay")
        .classList.add("aberto");
}


// ==========================================
// FECHAR CARRINHO
// ==========================================

function fecharCarrinho() {

    document
        .getElementById("carrinho")
        .classList.remove("aberto");

    document
        .getElementById("overlay")
        .classList.remove("aberto");
}


// ==========================================
// FILTRO DO CARDÁPIO
// ==========================================

function filtrar(categoria, botao) {

    const pizzas =
        document.querySelectorAll(".pizza-card");

    const botoes =
        document.querySelectorAll(".filtro");


    botoes.forEach(item => {
        item.classList.remove("ativo");
    });

    botao.classList.add("ativo");


    pizzas.forEach(pizza => {

        const categoriaPizza =
            pizza.dataset.categoria;

        if (
            categoria === "todas" ||
            categoriaPizza === categoria
        ) {

            pizza.style.display = "block";

        } else {

            pizza.style.display = "none";

        }

    });
}


// ==========================================
// FINALIZAR PEDIDO
// ==========================================

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }


    let mensagem =
        "Olá! Gostaria de fazer um pedido:%0A%0A";


    let total = 0;


    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;


        mensagem +=
            `🍕 ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}%0A`;

    });


    mensagem +=
        `%0A💰 Total: R$ ${total.toFixed(2)}`;


    // Troque pelo número real do WhatsApp
    const telefone = "5511999999999";


    const url =
        `https://wa.me/${telefone}?text=${mensagem}`;


    window.open(url, "_blank");

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    atualizarCarrinho();

});
