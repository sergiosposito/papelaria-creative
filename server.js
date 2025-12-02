// init-database.js - Script para inicializar o banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'papelaria.db');

// Remover banco existente se houver
if (fs.existsSync(dbPath)) {
    console.log('⚠ Removendo banco de dados existente...');
    fs.unlinkSync(dbPath);
}

// Criar novo banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao criar banco de dados:', err);
        return;
    }
    console.log('✓ Banco de dados criado:', dbPath);
});

// Executar criação das tabelas e inserção de dados
db.serialize(() => {
    console.log('📋 Criando tabelas...');

    // Criar tabela de categorias
    db.run(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela categorias:', err);
        else console.log('✓ Tabela categorias criada');
    });

    // Criar tabela de produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            preco_promocional REAL,
            categoria_id INTEGER,
            imagem_url TEXT,
            estoque INTEGER DEFAULT 0,
            destaque INTEGER DEFAULT 0,
            novidade INTEGER DEFAULT 0,
            mais_vendido INTEGER DEFAULT 0,
            ativo INTEGER DEFAULT 1,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela produtos:', err);
        else console.log('✓ Tabela produtos criada');
    });

    console.log('\n📦 Inserindo categorias...');

    // Inserir categorias
    const categorias = [
        ['Papelaria', 'Produtos básicos de papelaria'],
        ['Escritório', 'Material para escritório'],
        ['Brinquedos', 'Brinquedos educativos e diversão'],
        ['Papéis Especiais', 'Papéis para impressão e artesanato'],
        ['Artesanato', 'Material para trabalhos manuais'],
        ['Mochilas e Bolsas', 'Mochilas escolares e bolsas']
    ];

    const stmtCategoria = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
    categorias.forEach(cat => {
        stmtCategoria.run(cat);
    });
    stmtCategoria.finalize(() => {
        console.log(`✓ ${categorias.length} categorias inseridas`);
    });

    console.log('📦 Inserindo produtos...');

    // Inserir produtos
    const produtos = [
        // Novidades
        ['Tinta Glitter Spray', 'Tinta spray com glitter para artesanato e decoração', 18.00, null, 5, 'imagens/nov1.jpg', 45, 1, 0, 1],
        ['Livro Caça-Palavras', 'Livro de passatempos com 100 caça-palavras', 20.00, null, 3, 'imagens/nov2.jpg', 30, 1, 0, 0],
        ['Mochila Marie', 'Mochila escolar personagem Marie', 54.00, 48.60, 6, 'imagens/nov3.jpg', 15, 1, 0, 1],
        ['Giz Líquido', 'Giz líquido colorido para quadro branco', 19.00, null, 1, 'imagens/nov4.jpg', 60, 1, 0, 0],
        ['Lousa Verde', 'Lousa verde para giz 60x40cm', 98.00, 88.20, 2, 'imagens/nov5.jpg', 12, 1, 0, 1],
        ['Kit Canetas Glitter', 'Kit com 12 canetas gel glitter coloridas', 18.00, null, 1, 'imagens/nov6.jpg', 50, 1, 0, 0],

        // Mais Vendidos
        ['Borracha Faber Castell', 'Borracha branca pequena Faber Castell', 12.00, null, 1, 'imagens/mv1.jpg', 200, 0, 1, 0],
        ['Caneta Bic 4 Cores', 'Caneta esferográfica 4 cores em 1', 12.95, null, 1, 'imagens/mv2.jpg', 150, 0, 1, 1],
        ['Papel Glossy', 'Papel fotográfico glossy A4 180g - 20 folhas', 23.00, null, 4, 'imagens/mv3.jpg', 80, 0, 1, 0],
        ['Marcador Retro', 'Marcador de texto tons pastel - kit 6 cores', 12.95, null, 1, 'imagens/mv4.jpg', 95, 0, 1, 0],
        ['Sulfite Epson', 'Resma papel sulfite A4 75g - 500 folhas', 235.00, 211.50, 4, 'imagens/mv5.jpg', 40, 0, 1, 1],
        ['Caderno Tilibra', 'Caderno universitário 10 matérias 200 folhas', 29.95, null, 1, 'imagens/mv6.jpg', 120, 0, 1, 0],

        // Produtos adicionais
        ['Lápis Preto Faber Castell', 'Lápis grafite HB - caixa com 12 unidades', 15.90, null, 1, 'imagens/produtos/lapis-preto.jpg', 180, 0, 0, 0],
        ['Apontador com Depósito', 'Apontador duplo com depósito cores variadas', 8.50, null, 1, 'imagens/produtos/apontador.jpg', 140, 0, 0, 0],
        ['Régua 30cm Transparente', 'Régua acrílica transparente graduada', 5.90, null, 1, 'imagens/produtos/regua.jpg', 200, 0, 0, 0],
        ['Tesoura Escolar', 'Tesoura sem ponta 13cm cores sortidas', 9.90, null, 1, 'imagens/produtos/tesoura.jpg', 95, 0, 0, 0],
        ['Cola Bastão 40g', 'Cola em bastão branca lavável', 7.50, null, 1, 'imagens/produtos/cola-bastao.jpg', 160, 0, 0, 0],
        ['Cola Branca 90g', 'Cola escolar branca líquida', 6.90, null, 1, 'imagens/produtos/cola-branca.jpg', 175, 0, 0, 0],
        ['Canetinha Hidrográfica 12 Cores', 'Conjunto de canetinhas laváveis', 16.90, null, 1, 'imagens/produtos/canetinha.jpg', 85, 0, 0, 0],
        ['Lápis de Cor 24 Cores', 'Caixa de lápis de cor sextavado', 28.90, 25.90, 1, 'imagens/produtos/lapis-cor.jpg', 70, 0, 0, 0],
        ['Giz de Cera 12 Cores', 'Giz de cera grosso sortido', 11.50, null, 1, 'imagens/produtos/giz-cera.jpg', 110, 0, 0, 0],
        ['Massa de Modelar 12 Cores', 'Kit massa de modelar atóxica', 19.90, null, 3, 'imagens/produtos/massa-modelar.jpg', 55, 0, 0, 0],
        ['Tinta Guache 6 Cores', 'Tinta guache 15ml cada cor', 14.90, null, 5, 'imagens/produtos/tinta-guache.jpg', 65, 0, 0, 0],
        ['Pincel Escolar Kit 3un', 'Conjunto de pincéis para pintura', 12.90, null, 5, 'imagens/produtos/pincel.jpg', 48, 0, 0, 0],
        ['Pasta Catálogo 100 Folhas', 'Pasta plástica com 100 envelopes', 24.90, null, 2, 'imagens/produtos/pasta-catalogo.jpg', 40, 0, 0, 0],
        ['Pasta Suspensa Kraft', 'Pasta suspensa kraft - pacote 10un', 32.90, null, 2, 'imagens/produtos/pasta-suspensa.jpg', 35, 0, 0, 0],
        ['Clips Nº 2/0 Galvanizado', 'Caixa com 500 clips', 8.90, null, 2, 'imagens/produtos/clips.jpg', 90, 0, 0, 0],
        ['Grampeador Mini', 'Grampeador de mesa até 20 folhas', 18.90, null, 2, 'imagens/produtos/grampeador.jpg', 52, 0, 0, 0],
        ['Grampos 26/6 - 5000un', 'Caixa de grampos galvanizados', 6.50, null, 2, 'imagens/produtos/grampos.jpg', 125, 0, 0, 0],
        ['Perfurador 2 Furos', 'Perfurador de papel até 25 folhas', 22.90, null, 2, 'imagens/produtos/perfurador.jpg', 38, 0, 0, 0],
        ['Fita Adesiva Transparente', 'Fita adesiva 12mm x 33m', 3.90, null, 2, 'imagens/produtos/fita-adesiva.jpg', 200, 0, 0, 0],
        ['Post-it Neon 4 Cores', 'Bloco adesivo neon 76x76mm - 4 blocos', 16.50, null, 2, 'imagens/produtos/post-it.jpg', 88, 0, 0, 0],
        ['Caderno Brochura 96 Folhas', 'Caderno capa dura pequeno', 12.90, null, 1, 'imagens/produtos/caderno-brochura.jpg', 130, 0, 0, 0],
        ['Caderno de Desenho A4', 'Caderno de desenho 48 folhas', 18.90, null, 1, 'imagens/produtos/caderno-desenho.jpg', 75, 0, 0, 0],
        ['Bloco de Notas A4', 'Bloco de anotações 100 folhas', 9.90, null, 2, 'imagens/produtos/bloco-notas.jpg', 95, 0, 0, 0],
        ['Papel Cartão Colorido 10 Cores', 'Pacote com 10 folhas A4', 8.50, null, 4, 'imagens/produtos/papel-cartao.jpg', 105, 0, 0, 0],
        ['Papel Crepom 12 Cores', 'Papel crepom para artesanato', 15.90, null, 4, 'imagens/produtos/papel-crepom.jpg', 82, 0, 0, 0],
        ['EVA Colorido 10 Cores', 'Placas EVA 40x60cm - 10 cores', 22.90, null, 5, 'imagens/produtos/eva.jpg', 68, 0, 0, 0],
        ['Glitter Colorido 6 Cores', 'Pote de glitter 15g cada cor', 13.90, null, 5, 'imagens/produtos/glitter.jpg', 72, 0, 0, 0],
        ['Mochila Infantil Dinossauro', 'Mochila escolar estampa dinossauro', 62.90, 56.60, 6, 'imagens/produtos/mochila-dino.jpg', 22, 0, 0, 0]
    ];

    const stmtProduto = db.prepare(`
        INSERT INTO produtos 
        (nome, descricao, preco, preco_promocional, categoria_id, imagem_url, estoque, novidade, mais_vendido, destaque)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    produtos.forEach(prod => {
        stmtProduto.run(prod);
    });

    stmtProduto.finalize(() => {
        console.log(`✓ ${produtos.length} produtos inseridos`);
    });

    console.log('\n📊 Criando índices...');

    // Criar índices
    db.run('CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_produtos_novidade ON produtos(novidade)');
    db.run('CREATE INDEX IF NOT EXISTS idx_produtos_mais_vendido ON produtos(mais_vendido)');
    db.run('CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque)');
    db.run('CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo)', (err) => {
        if (err) console.error('Erro ao criar índices:', err);
        else console.log('✓ Índices criados');
    });
});

// Fechar conexão
db.close((err) => {
    if (err) {
        console.error('❌ Erro ao fechar banco:', err);
    } else {
        console.log('\n✅ Banco de dados inicializado com sucesso!');
        console.log('📁 Arquivo criado:', dbPath);
        console.log('\n🚀 Você já pode executar: npm start');
    }
});