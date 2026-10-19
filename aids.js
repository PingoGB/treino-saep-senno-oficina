
import express from 'express';
import pool from './db.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = 3000;

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const resultado = await pool.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                erro: 'Credenciais inválidas'
            });
        }

        const usuario = resultado.rows[0];

        if (usuario.senha !== senha) {
            return res.status(401).json({
                erro: 'Credenciais inválidas'
            });
        }

        res.status(200).json({
            mensagem: 'Login realizado',
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro no login' });
    }
});

// LISTAR E BUSCAR CLIENTES
app.get('/clientes', async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const resultado = await pool.query(
            `SELECT * FROM cliente
             WHERE nome ILIKE $1
                OR email ILIKE $1
                OR cpf ILIKE $1
             ORDER BY nome ASC`,
            [`%${busca}%`]
        );

        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao listar clientes' });
    }
});

// BUSCAR CLIENTE POR ID
app.get('/clientes/:id', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM cliente WHERE id = $1',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao consultar cliente' });
    }
});

// CADASTRAR CLIENTE
app.post('/clientes', async (req, res) => {
    try {
        const { nome, email, cpf } = req.body;

        const resultado = await pool.query(
            `INSERT INTO cliente (nome, email, cpf)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nome, email, cpf]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
    }
});

// EDITAR CLIENTE
app.put('/clientes/:id', async (req, res) => {
    try {
        const { nome, email, cpf } = req.body;

        const resultado = await pool.query(
            `UPDATE cliente
             SET nome = $1, email = $2, cpf = $3
             WHERE id = $4
             RETURNING *`,
            [nome, email, cpf, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao editar cliente' });
    }
});

// EXCLUIR CLIENTE
app.delete('/clientes/:id', async (req, res) => {
    try {
        const resultado = await pool.query(
            'DELETE FROM cliente WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Cliente excluído'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Não foi possível excluir o cliente. Verifique os vínculos.'
        });
    }
});

// LISTAR VEÍCULOS
app.get('/carros', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                carro.*,
                cliente.nome AS nome_cliente
            FROM carro
            JOIN cliente ON carro.id_cliente = cliente.id
            ORDER BY carro.modelo ASC
        `);

        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao listar veículos' });
    }
});

// CADASTRAR VEÍCULO ASSOCIADO A CLIENTE
app.post('/carros', async (req, res) => {
    try {
        const { modelo, placa, ano, id_cliente } = req.body;

        const resultado = await pool.query(
            `INSERT INTO carro (modelo, placa, ano, id_cliente)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [modelo, placa, ano, id_cliente]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao cadastrar veículo. Verifique os dados e o cliente.'
        });
    }
});

// EDITAR VEÍCULO
app.put('/carros/:id', async (req, res) => {
    try {
        const { modelo, placa, ano, id_cliente } = req.body;

        const resultado = await pool.query(
            `UPDATE carro
             SET modelo = $1, placa = $2, ano = $3, id_cliente = $4
             WHERE id = $5
             RETURNING *`,
            [modelo, placa, ano, id_cliente, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Veículo não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao editar veículo' });
    }
});

// EXCLUIR VEÍCULO
app.delete('/carros/:id', async (req, res) => {
    try {
        const resultado = await pool.query(
            'DELETE FROM carro WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Veículo não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Veículo excluído'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Não foi possível excluir o veículo. Verifique os vínculos.'
        });
    }
});

// LISTAR AGENDAMENTOS COM DADOS DO CLIENTE E VEÍCULO
app.get('/agendamentos', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                agendamento.*,
                cliente.nome AS nome_cliente,
                cliente.email AS email_cliente,
                cliente.cpf AS cpf_cliente,
                carro.modelo AS modelo_carro,
                carro.placa AS placa_carro,
                carro.ano AS ano_carro
            FROM agendamento
            JOIN cliente
                ON agendamento.id_cliente = cliente.id
            JOIN carro
                ON agendamento.id_carro = carro.id
            ORDER BY agendamento.data_agendamento ASC
        `);

        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao listar agendamentos'
        });
    }
});

// CADASTRAR AGENDAMENTO
app.post('/agendamentos', async (req, res) => {
    try {
        const {
            id_cliente,
            id_carro,
            servico,
            data_agendamento
        } = req.body;

        const resultado = await pool.query(
            `INSERT INTO agendamento
             (id_cliente, id_carro, servico, data_agendamento)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id_cliente, id_carro, servico, data_agendamento]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao cadastrar agendamento'
        });
    }
});

// EDITAR AGENDAMENTO
app.put('/agendamentos/:id', async (req, res) => {
    try {
        const {
            id_cliente,
            id_carro,
            servico,
            data_agendamento
        } = req.body;

        const resultado = await pool.query(
            `UPDATE agendamento
             SET id_cliente = $1,
                 id_carro = $2,
                 servico = $3,
                 data_agendamento = $4
             WHERE id = $5
             RETURNING *`,
            [
                id_cliente,
                id_carro,
                servico,
                data_agendamento,
                req.params.id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Agendamento não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao editar agendamento'
        });
    }
});

// EXCLUIR AGENDAMENTO
app.delete('/agendamentos/:id', async (req, res) => {
    try {
        const resultado = await pool.query(
            'DELETE FROM agendamento WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Agendamento não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Agendamento excluído'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao excluir agendamento'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
