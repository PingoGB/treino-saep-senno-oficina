import express from 'express'
import pool from './db.js'
import cors from 'cors'

const app = express()
app.use (express.json())
app.use (cors())
app.use (express.static('public'))
const PORT = 3000

app.post('/login', async (req, res) =>{
    const {email, senha} = req.body;

    const login = await pool.query("SELECT * FROM usuario WHERE email = $1", [email])

    if (login.rows.length === 0){
        res.status(400).json({erro: "credenciais inválidas"})
    }

    const colaborador = login.rows[0]

    if (colaborador.email !== email){
        res.status(400).json({erro: "credenciais inválidas"})
    }

    if (colaborador.senha !== senha){
        res.status(400).json({erro: "credenciais inválidas"})
    }

    res.status(200).json({
        mensagem: "login realizado",
        user:{
            "nome": colaborador.nome
        }
    })
})

app.post ('cliente', async (req, res) =>{
    const {nome, email, cpf} = req.body;

    const postCliente = await pool.query("INSERT INTO cliente (nome, email, senha) VALUES ($1, $2, $3)", [nome, email, cpf])
    res.status.json(postCliente.rows[0])
})

app.post('carro', async (req,res) =>{
    const {modelo, placa, ano, idCliente} = req.body;

    const postCarro = await pool.query("INSERT INTO carro (modelo, placa, ano, idCliente) VALUES ($1, $2, $3, $4)", [modelo, placa, ano, idCliente])
    res.status(200).json(postCarro.rows[0])
})

app.post('/agendamento', async (req, res) =>{
    const {id_cliente, id_carro, servico, data_agendamento} = req.body;

    const postAgendamento = await pool.query('INSERT INTO agendamento (id_cliente, id_carro, servico, data_agendamento) VALUES ($1, $2, $3, $4)', [id_cliente, id_carro, servico, data_agendamento])
    res.status(200).json(postAgendamento.rows[0])
})

app.get('/agendamentoOrdenado', async (req, res) =>{
    const ordenar = await pool.query("SELECT agendamento.*, cliente.*, carro.* FROM agendamento JOIN cliente ON agendamento.id_cliente = cliente.id JOIN carro ON agendamento.id_carro = carro.id ORDER BY agendamento.data_agendamento ASC")
    res.status(201).json(ordenar.rows)
})

app.listen(PORT, ()=>{
    console.log(`Server rodando na porta: ${PORT}`)
})