-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS creative_papelaria;
USE creative_papelaria;

-- Tabela de categorias
CREATE TABLE categorias (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            nome VARCHAR(100) NOT NULL,
                            descricao TEXT,
                            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE produtos (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          nome VARCHAR(200) NOT NULL,
                          descricao TEXT,
                          preco DECIMAL(10, 2) NOT NULL,
                          preco_promocional DECIMAL(10, 2),
                          categoria_id INT,
                          imagem_url VARCHAR(500),
                          estoque INT DEFAULT 0,
                          destaque BOOLEAN DEFAULT FALSE,
                          novidade BOOLEAN DEFAULT FALSE,
                          mais_vendido BOOLEAN DEFAULT FALSE,
                          ativo BOOLEAN DEFAULT TRUE,
                          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Inserção das categorias
INSERT INTO categorias (nome, descricao) VALUES
                                             ('Papelaria', 'Produtos básicos de papelaria'),
                                             ('Escritório', 'Material para escritório'),
                                             ('Brinquedos', 'Brinquedos educativos e diversão'),
                                             ('Papéis Especiais', 'Papéis para impressão e artesanato'),
                                             ('Artesanato', 'Material para trabalhos manuais'),
                                             ('Mochilas e Bolsas', 'Mochilas escolares e bolsas');

-- Inserção de 40 produtos
INSERT INTO produtos (nome, descricao, preco, preco_promocional, categoria_id, imagem_url, estoque, novidade, mais_vendido, destaque) VALUES
-- Novidades (6 produtos)
('Tinta Glitter Spray', 'Tinta spray com glitter para artesanato e decoração', 18.00, NULL, 5, 'imagens/nov1.jpg', 45, TRUE, FALSE, TRUE),
('Livro Caça-Palavras', 'Livro de passatempos com 100 caça-palavras', 20.00, NULL, 3, 'imagens/nov2.jpg', 30, TRUE, FALSE, FALSE),
('Mochila Marie', 'Mochila escolar personagem Marie', 54.00, 48.60, 6, 'imagens/nov3.jpg', 15, TRUE, FALSE, TRUE),
('Giz Líquido', 'Giz líquido colorido para quadro branco', 19.00, NULL, 1, 'imagens/nov4.jpg', 60, TRUE, FALSE, FALSE),
('Lousa Verde', 'Lousa verde para giz 60x40cm', 98.00, 88.20, 2, 'imagens/nov5.jpg', 12, TRUE, FALSE, TRUE),
('Kit Canetas Glitter', 'Kit com 12 canetas gel glitter coloridas', 18.00, NULL, 1, 'imagens/nov6.jpg', 50, TRUE, FALSE, FALSE),

-- Mais Vendidos (6 produtos)
('Borracha Faber Castell', 'Borracha branca pequena Faber Castell', 12.00, NULL, 1, 'imagens/mv1.jpg', 200, FALSE, TRUE, FALSE),
('Caneta Bic 4 Cores', 'Caneta esferográfica 4 cores em 1', 12.95, NULL, 1, 'imagens/mv2.jpg', 150, FALSE, TRUE, TRUE),
('Papel Glossy', 'Papel fotográfico glossy A4 180g - 20 folhas', 23.00, NULL, 4, 'imagens/mv3.jpg', 80, FALSE, TRUE, FALSE),
('Marcador Retro', 'Marcador de texto tons pastel - kit 6 cores', 12.95, NULL, 1, 'imagens/mv4.jpg', 95, FALSE, TRUE, FALSE),
('Sulfite Epson', 'Resma papel sulfite A4 75g - 500 folhas', 235.00, 211.50, 4, 'imagens/mv5.jpg', 40, FALSE, TRUE, TRUE),
('Caderno Tilibra', 'Caderno universitário 10 matérias 200 folhas', 29.95, NULL, 1, 'imagens/mv6.jpg', 120, FALSE, TRUE, FALSE),

-- Produtos adicionais (28 produtos)
('Lápis Preto Faber Castell', 'Lápis grafite HB - caixa com 12 unidades', 15.90, NULL, 1, 'imagens/produtos/lapis-preto.jpg', 180, FALSE, FALSE, FALSE),
('Apontador com Depósito', 'Apontador duplo com depósito cores variadas', 8.50, NULL, 1, 'imagens/produtos/apontador.jpg', 140, FALSE, FALSE, FALSE),
('Régua 30cm Transparente', 'Régua acrílica transparente graduada', 5.90, NULL, 1, 'imagens/produtos/regua.jpg', 200, FALSE, FALSE, FALSE),
('Tesoura Escolar', 'Tesoura sem ponta 13cm cores sortidas', 9.90, NULL, 1, 'imagens/produtos/tesoura.jpg', 95, FALSE, FALSE, FALSE),
('Cola Bastão 40g', 'Cola em bastão branca lavável', 7.50, NULL, 1, 'imagens/produtos/cola-bastao.jpg', 160, FALSE, FALSE, FALSE),
('Cola Branca 90g', 'Cola escolar branca líquida', 6.90, NULL, 1, 'imagens/produtos/cola-branca.jpg', 175, FALSE, FALSE, FALSE),
('Canetinha Hidrográfica 12 Cores', 'Conjunto de canetinhas laváveis', 16.90, NULL, 1, 'imagens/produtos/canetinha.jpg', 85, FALSE, FALSE, FALSE),
('Lápis de Cor 24 Cores', 'Caixa de lápis de cor sextavado', 28.90, 25.90, 1, 'imagens/produtos/lapis-cor.jpg', 70, FALSE, FALSE, FALSE),
('Giz de Cera 12 Cores', 'Giz de cera grosso sortido', 11.50, NULL, 1, 'imagens/produtos/giz-cera.jpg', 110, FALSE, FALSE, FALSE),
('Massa de Modelar 12 Cores', 'Kit massa de modelar atóxica', 19.90, NULL, 3, 'imagens/produtos/massa-modelar.jpg', 55, FALSE, FALSE, FALSE),
('Tinta Guache 6 Cores', 'Tinta guache 15ml cada cor', 14.90, NULL, 5, 'imagens/produtos/tinta-guache.jpg', 65, FALSE, FALSE, FALSE),
('Pincel Escolar Kit 3un', 'Conjunto de pincéis para pintura', 12.90, NULL, 5, 'imagens/produtos/pincel.jpg', 48, FALSE, FALSE, FALSE),
('Pasta Catálogo 100 Folhas', 'Pasta plástica com 100 envelopes', 24.90, NULL, 2, 'imagens/produtos/pasta-catalogo.jpg', 40, FALSE, FALSE, FALSE),
('Pasta Suspensa Kraft', 'Pasta suspensa kraft - pacote 10un', 32.90, NULL, 2, 'imagens/produtos/pasta-suspensa.jpg', 35, FALSE, FALSE, FALSE),
('Clips Nº 2/0 Galvanizado', 'Caixa com 500 clips', 8.90, NULL, 2, 'imagens/produtos/clips.jpg', 90, FALSE, FALSE, FALSE),
('Grampeador Mini', 'Grampeador de mesa até 20 folhas', 18.90, NULL, 2, 'imagens/produtos/grampeador.jpg', 52, FALSE, FALSE, FALSE),
('Grampos 26/6 - 5000un', 'Caixa de grampos galvanizados', 6.50, NULL, 2, 'imagens/produtos/grampos.jpg', 125, FALSE, FALSE, FALSE),
('Perfurador 2 Furos', 'Perfurador de papel até 25 folhas', 22.90, NULL, 2, 'imagens/produtos/perfurador.jpg', 38, FALSE, FALSE, FALSE),
('Fita Adesiva Transparente', 'Fita adesiva 12mm x 33m', 3.90, NULL, 2, 'imagens/produtos/fita-adesiva.jpg', 200, FALSE, FALSE, FALSE),
('Post-it Neon 4 Cores', 'Bloco adesivo neon 76x76mm - 4 blocos', 16.50, NULL, 2, 'imagens/produtos/post-it.jpg', 88, FALSE, FALSE, FALSE),
('Caderno Brochura 96 Folhas', 'Caderno capa dura pequeno', 12.90, NULL, 1, 'imagens/produtos/caderno-brochura.jpg', 130, FALSE, FALSE, FALSE),
('Caderno de Desenho A4', 'Caderno de desenho 48 folhas', 18.90, NULL, 1, 'imagens/produtos/caderno-desenho.jpg', 75, FALSE, FALSE, FALSE),
('Bloco de Notas A4', 'Bloco de anotações 100 folhas', 9.90, NULL, 2, 'imagens/produtos/bloco-notas.jpg', 95, FALSE, FALSE, FALSE),
('Papel Cartão Colorido 10 Cores', 'Pacote com 10 folhas A4', 8.50, NULL, 4, 'imagens/produtos/papel-cartao.jpg', 105, FALSE, FALSE, FALSE),
('Papel Crepom 12 Cores', 'Papel crepom para artesanato', 15.90, NULL, 4, 'imagens/produtos/papel-crepom.jpg', 82, FALSE, FALSE, FALSE),
('EVA Colorido 10 Cores', 'Placas EVA 40x60cm - 10 cores', 22.90, NULL, 5, 'imagens/produtos/eva.jpg', 68, FALSE, FALSE, FALSE),
('Glitter Colorido 6 Cores', 'Pote de glitter 15g cada cor', 13.90, NULL, 5, 'imagens/produtos/glitter.jpg', 72, FALSE, FALSE, FALSE),
('Mochila Infantil Dinossauro', 'Mochila escolar estampa dinossauro', 62.90, 56.60, 6, 'imagens/produtos/mochila-dino.jpg', 22, FALSE, FALSE, FALSE);

-- Criação de índices para melhor performance
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_novidade ON produtos(novidade);
CREATE INDEX idx_produtos_mais_vendido ON produtos(mais_vendido);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);