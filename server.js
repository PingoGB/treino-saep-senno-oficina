import express from 'express'
import pool from './db.js'
import cors from 'cors'
import bcrypt from 'bcryptjs'

const app = express()
app.use (express.json())
app.use (cors())
app.use (express.static('public'))
const PORT = 3000

app.post('/sign', async (req, res) =>{
    const {nome, email, senha} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt)
    const sign = await pool.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *", [nome, email, hashedPassword])
    res.status(201).json(sign.rows[0])
})

app.post('/login', async (req, res) =>{
    const {email, senha} = req.body;

    const login = await pool.query("SELECT * FROM usuario WHERE email = $1", [email])

    if (login.rows.length === 0){
        return res.status(400).json({erro: "credenciais inválidas"})
    }

    const colaborador = login.rows[0]

    if (colaborador.email !== email){
        return res.status(400).json({erro: "credenciais inválidas"})
    }

    const isPasswordValid = await bcrypt.compare(senha, colaborador.senha)
    if (!isPasswordValid){
        return res.status(400).json({erro: "credenciais inválidas"})
    }

    return res.status(200).json({
        mensagem: "login realizado",
        user:{
            "nome": colaborador.nome
        }
    })
})

app.get('/usuario', async (req, res) =>{
    const getColaborador = await pool.query('SELECT * FROM usuario')
    return res.status(200).json(getColaborador.rows)
})

app.post ('/cliente', async (req, res) =>{
    const {nome, email, cpf} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedCpf = await bcrypt.hash(cpf, salt)

    const postCliente = await pool.query("INSERT INTO cliente (nome, email, cpf) VALUES ($1, $2, $3) RETURNING *", [nome, email, hashedCpf])
    res.status(201).json(postCliente.rows[0])
})

app.get('/cliente', async (req, res) =>{
    const getCliente = await pool.query("SELECT * FROM cliente")
    res.status(200).json(getCliente.rows)
})

app.get('/cliente/:id', async (req, res) =>{
    const getCliente = await pool.query("SELECT * FROM cliente WHERE id = $1", [req.params.id])
    res.status(200).json(getCliente.rows)
})

app.put('/cliente/:id', async (req, res) =>{
    const {nome, email, cpf} = req.body
    const putCliente = await pool.query("UPDATE cliente SET nome = $1, email = $2, cpf = $3 WHERE id = $4 RETURNING *", [nome, email, cpf, req.params.id])
    if (putCliente.rows.length === 0){
        res.status(400).json({erro: "Cliente não encontrado"})
    }
    res.status(200).json(putCliente.rows[0])
})

app.delete('/cliente/:id', async (req,res) =>{
    const deleteCliente = await pool.query("DELETE FROM cliente WHERE id = $1 RETURNING *", [req.params.id])
    res.status(200).json("Cliente excluído")
})

app.post('/carro', async (req,res) =>{
    const {modelo, placa, ano, idCliente} = req.body;

    const postCarro = await pool.query("INSERT INTO carro (modelo, placa, ano, idCliente) VALUES ($1, $2, $3, $4) RETURNING *", [modelo, placa, ano, idCliente])
    res.status(200).json(postCarro.rows[0])
})

app.get('/carro', async (req,res) =>{
    const getCarro = await pool.query("SELECT * FROM carro")
    res.status(200).json(getCarro.rows)
})

app.put('/carro/:id', async (req,res) =>{
    const {modelo, placa, ano, idCliente} = req.body
    const putCarro = await pool.query("UPDATE carro SET modelo = $1, placa = $2, ano = $3, idCliente = $4  WHERE id= $5 RETURNING *", [modelo, placa, ano, idCliente, req.params.id])
    if (putCarro.rows.length === 0){
        res.status(400).json({erro: "Carro não encontrado"})
    }
    res.status(200).json(putCarro.rows[0])
})

app.delete('/carro/:id', async (req, res) =>{
    const deleteCarro = await pool.query("DELETE FROM carro WHERE id = $1 RETURNING *", [req.params.id])
    if (deleteCarro.rows.length === 0){
        res.status(400).json({erro: "Carro não existe"})
    }
    res.status(200).json("Carro excluído")
})

app.post('/agendamento', async (req, res) =>{
    const {id_cliente, id_carro, servico, data_agendamento} = req.body;

    const postAgendamento = await pool.query('INSERT INTO agendamento (id_cliente, id_carro, servico, data_agendamento) VALUES ($1, $2, $3, $4)', [id_cliente, id_carro, servico, data_agendamento])
    res.status(200).json(postAgendamento.rows[0])
})

app.get('/agendamento', async (req, res) =>{
    const ordenar = await pool.query("SELECT agendamento.*, cliente.*, carro.* FROM agendamento JOIN cliente ON agendamento.id_cliente = cliente.id JOIN carro ON agendamento.id_carro = carro.id ORDER BY agendamento.data_agendamento ASC")
    res.status(201).json(ordenar.rows)
})

app.put('/agendamento/:id', async (req,res) =>{
    const {id_cliente, id_carro, servico, data_agendamento} = req.body
    const putAgendamento = await pool.query("UPDATE agendamento SET id_cliente = $1, id_carro = $2, servico = $3, data_agendamento = $4 WHERE id = $5 RETURNING *", [id_cliente, id_carro, servico, data_agendamento, req.params.id])
    res.status(200).json(putAgendamento.rows[0])
})

app.delete('/agendamento/:id', async (req, res) =>{
    const deleteAgendamento = await pool.query("DELETE FROM agendamento WHERE id = $1 RETURNING *", [req.params.id])
    res.status(200).json("Agendamento cancelado.")
})

app.listen(PORT, ()=>{
    console.log(`Server rodando na porta: ${PORT}`)
})