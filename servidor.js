const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// --- 1. Camada de Conexão com o Banco de Dados ---
class DatabaseConnection {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) reject(err); else resolve({id: this.lastID, changes: this.changes});
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }
}

// --- 2. Camada de Repositório (Produto) ---
class ProdutoRepository {
    constructor(db) {
        this.db = db;
    }

    // LISTAR COM FILTROS (Modificado para incluir preco_promocional e estoque)
    async listarComFiltros(filtros = {}) {
        // Adicionando 'preco_promocional' e 'estoque' ao SELECT
        let sql = 'SELECT id, nome, descricao, preco, preco_promocional, estoque, categoria_id, novidade, mais_vendido, destaque, ativo, imagem_url FROM produtos WHERE ativo = 1';
        const params = [];

        for (const key of ['novidade', 'mais_vendido', 'destaque']) {
            if (filtros[key] === 'true') { // 'true' vem do JavaScript
                sql += ` AND ${key} = 1`;
            }
        }

        if (filtros.categoria) {
            sql += ' AND categoria_id = ?';
            params.push(filtros.categoria);
        }

        if (filtros.busca) {
            sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
            const termoBusca = `%${filtros.busca}%`;
            params.push(termoBusca, termoBusca);
        }

        return this.db.query(sql, params);
    }

    buscarPorId(id) {
        return this.db.get('SELECT * FROM produtos WHERE id = ? AND ativo = 1', [id]);
    }

    listarDestaques() {
        return this.db.query('SELECT * FROM produtos WHERE destaque = 1 AND ativo = 1');
    }

    criar(produto) {
        // ... (lógica de criação, não alterada aqui)
        const {
            nome,
            descricao,
            preco,
            preco_promocional,
            estoque,
            categoria_id,
            novidade,
            mais_vendido,
            destaque,
            imagem_url
        } = produto;
        const sql = `
            INSERT INTO produtos (nome, descricao, preco, preco_promocional, estoque, categoria_id, novidade,
                                  mais_vendido, destaque, ativo, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `;
        const params = [nome, descricao, preco, preco_promocional || null, estoque || 0, categoria_id, novidade ? 1 : 0, mais_vendido ? 1 : 0, destaque ? 1 : 0, imagem_url || ''];
        return this.db.run(sql, params);
    }

    atualizar(id, produto) {
        // ... (lógica de atualização, não alterada aqui)
        const campos = [];
        const params = [];
        for (const [key, value] of Object.entries(produto)) {
            if (key !== 'id' && key !== 'ativo') {
                campos.push(`${key} = ?`);
                const valor = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                params.push(valor);
            }
        }

        if (campos.length === 0) return Promise.resolve({changes: 0});

        params.push(id);
        const sql = `UPDATE produtos
                     SET ${campos.join(', ')}
                     WHERE id = ?
                       AND ativo = 1`;
        return this.db.run(sql, params);
    }

    deletar(id) {
        const sql = 'UPDATE produtos SET ativo = 0 WHERE id = ?';
        return this.db.run(sql, [id]);
    }
}

// --- 3. Camada de Repositório (Categoria) ---
class CategoriaRepository {
    constructor(db) {
        this.db = db;
    }

    listarTodas() {
        return this.db.query('SELECT id, nome FROM categorias'); // Seleciona apenas id e nome, conforme esperado pelo frontend
    }
}

// --- 4. Camada de Repositório (Orçamento) ---
class OrcamentoRepository {
    constructor(db) {
        this.db = db;
    }

    // Salva o orçamento na tabela `orcamentos` (você deve criar essa tabela no seu DB)
    salvar(dados) {
        // Você deve ter uma tabela chamada 'orcamentos' com as colunas correspondentes:
        // (nome, email, telefone, empresa, categoria, quantidade, produtos, mensagem, data_criacao)
        const {nome, email, telefone, empresa, categoria, quantidade, produtos, mensagem} = dados;
        const sql = `
            INSERT INTO orcamentos (nome, email, telefone, empresa, categoria, quantidade, produtos, mensagem,
                                    data_criacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;
        const params = [nome, email, telefone, empresa, categoria, quantidade, produtos, mensagem];
        return this.db.run(sql, params);
    }
}


// --- 5. Camada de Controller (Produto) ---
class ProdutoController {
    constructor(produtoRepo) {
        this.produtoRepo = produtoRepo;
    }

    // **MUDANÇA AQUI:** Resposta formatada
    listar = async (req, res) => {
        try {
            const produtos = await this.produtoRepo.listarComFiltros(req.query);
            res.json({sucesso: true, dados: produtos});
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao listar produtos.'});
        }
    };

    // **MUDANÇA AQUI:** Resposta formatada
    buscarPorId = async (req, res) => {
        try {
            const produto = await this.produtoRepo.buscarPorId(req.params.id);
            if (produto) {
                res.json({sucesso: true, dados: produto});
            } else {
                res.status(404).json({sucesso: false, mensagem: 'Produto não encontrado.'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao buscar produto.'});
        }
    };

    // **MUDANÇA AQUI:** Resposta formatada
    listarDestaques = async (req, res) => {
        try {
            const produtos = await this.produtoRepo.listarDestaques();
            res.json({sucesso: true, dados: produtos});
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao listar destaques.'});
        }
    };

    // **MUDANÇA AQUI:** Resposta formatada
    criar = async (req, res) => {
        try {
            if (!req.body.nome || !req.body.preco) {
                return res.status(400).json({sucesso: false, erro: 'Nome e preço são obrigatórios.'});
            }
            const resultado = await this.produtoRepo.criar(req.body);
            res.status(201).json({sucesso: true, dados: {id: resultado.id, ...req.body}});
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao criar produto.'});
        }
    };

    // **MUDANÇA AQUI:** Resposta formatada
    atualizar = async (req, res) => {
        try {
            const resultado = await this.produtoRepo.atualizar(req.params.id, req.body);
            if (resultado.changes > 0) {
                res.json({sucesso: true, mensagem: 'Produto atualizado com sucesso.'});
            } else {
                res.status(404).json({sucesso: false, mensagem: 'Produto não encontrado ou nada para atualizar.'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao atualizar produto.'});
        }
    };

    deletar = async (req, res) => {
        try {
            const resultado = await this.produtoRepo.deletar(req.params.id);
            if (resultado.changes > 0) {
                res.json({sucesso: true, mensagem: 'Produto deletado (soft delete) com sucesso.'});
            } else {
                res.status(404).json({sucesso: false, mensagem: 'Produto não encontrado.'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao deletar produto.'});
        }
    };
}

// --- 6. Camada de Controller (Categoria) ---
class CategoriaController {
    constructor(categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }

    // **MUDANÇA AQUI:** Resposta formatada
    listar = async (req, res) => {
        try {
            const categorias = await this.categoriaRepo.listarTodas();
            res.json({sucesso: true, dados: categorias});
        } catch (error) {
            console.error(error);
            res.status(500).json({sucesso: false, erro: 'Erro ao listar categorias.'});
        }
    };
}

// --- 7. Camada de Controller (Orçamento) ---
class OrcamentoController {
    constructor(orcamentoRepo) {
        this.orcamentoRepo = orcamentoRepo;
    }

    enviar = async (req, res) => {
        try {
            const {nome, email, telefone, produtos} = req.body;

            // Validação de campos obrigatórios
            if (!nome || !email || !telefone || !produtos) {
                return res.status(400).json({
                    sucesso: false, mensagem: 'Nome, E-mail, Telefone e Produtos de Interesse são obrigatórios.'
                });
            }

            // Salva o orçamento no banco de dados
            const resultado = await this.orcamentoRepo.salvar(req.body);

            // Resposta de sucesso esperada pelo frontend
            res.status(200).json({
                sucesso: true, mensagem: 'Orçamento enviado com sucesso! Entraremos em contato em breve.'
            });

        } catch (error) {
            console.error('Erro ao salvar orçamento:', error);
            res.status(500).json({sucesso: false, mensagem: 'Erro interno ao processar a solicitação de orçamento.'});
        }
    };
}


// --- 8. Classe Principal da Aplicação ---
class App {
    constructor() {
        this.app = express();
        this.db = null;
        this.configurar();
        this.rotas();
    }

    configurar() {
        this.app.use(express.json());
        this.app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

        // Habilitar CORS para o frontend (importante se estiverem em portas diferentes)
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // Permite qualquer origem
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        this.db = new DatabaseConnection(path.join(__dirname, 'papelaria.db'));
    }

    rotas() {
        // Instanciação das camadas
        const produtoRepo = new ProdutoRepository(this.db);
        const categoriaRepo = new CategoriaRepository(this.db);
        const orcamentoRepo = new OrcamentoRepository(this.db); // Novo Repositório

        const produtoCtrl = new ProdutoController(produtoRepo);
        const categoriaCtrl = new CategoriaController(categoriaRepo);
        const orcamentoCtrl = new OrcamentoController(orcamentoRepo); // Novo Controller

        // Rotas para Produtos
        this.app.get('/api/produtos', produtoCtrl.listar);
        this.app.get('/api/produtos/destaque', produtoCtrl.listarDestaques);
        this.app.get('/api/produtos/:id', produtoCtrl.buscarPorId);
        this.app.post('/api/produtos', produtoCtrl.criar);
        this.app.put('/api/produtos/:id', produtoCtrl.atualizar);
        this.app.delete('/api/produtos/:id', produtoCtrl.deletar);

        // Rotas para Categorias
        this.app.get('/api/categorias', categoriaCtrl.listar);

        // **NOVA ROTA PARA ORÇAMENTO**
        this.app.post('/api/orcamento', orcamentoCtrl.enviar);
    }

    start() {
        const PORT = 3000;
        this.app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
    }
}

new App().start();