const botaoProdutos = document.getElementById("btnProdutos");
const submenu = document.querySelector(".submenu");
const produtosArea = document.getElementById("produtos");

// abre/fecha o submenu
botaoProdutos.addEventListener("click", function(e) {
    e.preventDefault();
    submenu.style.display =
        submenu.style.display === "block" ? "none" : "block";
});

const categorias = {
    destaques: `
        <h2>Destaques</h2>
        <p>Produtos mais vendidos da semana:</p>
        <div>🛒 Produto 1 · 🛒 Produto 2 · 🛒 Produto 3</div>
    `,
    papelaria: `
        <h2>Papelaria</h2>
        <p>Cadernos, lápis, adesivos e mais!</p>
    `,
    escritorio: `
        <h2>Escritório</h2>
        <p>Pastas, canetas, organizadores e muito mais.</p>
    `,
    brinquedos: `
        <h2>Brinquedos</h2>
        <p>Jogos, brinquedos educativos e novidades.</p>
    `,
    papeis: `
        <h2>Papéis Especiais</h2>
        <p>Papel fotográfico, colorplus, couchê e mais.</p>
    `,
    artesanato: `
        <h2>Materiais de Artesanato</h2>
        <p>Tintas, EVA, pincéis, fitas e acessórios.</p>
    `
};

// clique para trocar conteúdo
document.querySelectorAll(".submenu a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const categoria = this.dataset.cat;

        produtosArea.innerHTML = categorias[categoria];
        submenu.style.display = "none";
    });
});
// === SISTEMA DE CARRINHO COM LOCALSTORAGE ===

// contador no ícone da cesta
const contadorCesta = document.querySelector(".contador");

// carrega carrinho do localStorage se existir
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// atualiza contador logo ao carregar a página
contadorCesta.textContent = carrinho.length;

// pega todos os botões comprar
const botoesComprar = document.querySelectorAll(".btn");

// adiciona ao carrinho
botoesComprar.forEach((botao) => {
    botao.addEventListener("click", function () {

        const figura = this.closest("figure");
        const nomeProduto = figura.querySelector("figcaption").innerText;

        // adiciona produto
        carrinho.push(nomeProduto);

        // salva no localStorage
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        event.preventDefault(); // garante que nada abra ou recarregue
        // atualiza contador
        contadorCesta.textContent = carrinho.length;
    });
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        contador++;
        atualizarCarrinho();
    });
});
