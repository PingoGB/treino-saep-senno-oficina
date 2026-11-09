import express from 'express'
import pool from './db.js'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use (express.json())
app.use (cors())
app.use(cookieParser())
const JWT_SECRET = process.env.JWT_SENHA
app.use (express.static('public'))
const SALT = await bcrypt.genSalt(10)
const PORT = 3000

function autenticarToken (req, res, next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({error: "Acesso nigado."})
    }
    try{
        const usuarioJWT = jwt.verify(token, JWT_SECRET)
        req.usuarioJWT = usuarioJWT;
        return next()
    } catch(err){
        return res.status(403).json("Erro ao formatar token.")
    }
}

app.post('/sign', async (req, res) =>{
    try {
        const {nome, email, senha} = req.body;
        const hashedPassword = await bcrypt.hash(senha, SALT)
        const sign = await pool.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *", [nome, email, hashedPassword])
        return res.status(201).json(sign.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.post('/login', async (req, res) =>{
    try {
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
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.get('/usuario', async (req, res) =>{
    try {
        const getColaborador = await pool.query('SELECT * FROM usuario')
        return res.status(200).json(getColaborador.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.post ('/cliente', async (req, res) =>{
    try {
        const {nome, email, cpf} = req.body;
        const hashedCpf = await bcrypt.hash(cpf, SALT)

        const postCliente = await pool.query("INSERT INTO cliente (nome, email, cpf) VALUES ($1, $2, $3) RETURNING *", [nome, email, hashedCpf])
        return res.status(201).json(postCliente.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.get('/cliente', async (req, res) =>{
    try {
        const getCliente = await pool.query("SELECT * FROM cliente")
        return res.status(200).json(getCliente.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.get('/cliente/:id', async (req, res) =>{
    try {
        const getCliente = await pool.query("SELECT * FROM cliente WHERE id = $1", [req.params.id])
        return res.status(200).json(getCliente.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.put('/cliente/:id', async (req, res) =>{
    try {
        const {nome, email, cpf} = req.body
        const hashedCpf = await bcrypt.hash(cpf, SALT)
        const putCliente = await pool.query("UPDATE cliente SET nome = $1, email = $2, cpf = $3 WHERE id = $4 RETURNING *", [nome, email, hashedCpf, req.params.id])
        if (putCliente.rows.length === 0){
            return res.status(400).json({erro: "Cliente não encontrado"})
        }
        return res.status(200).json(putCliente.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.delete('/cliente/:id', async (req,res) =>{
    try {
        const deleteCliente = await pool.query("DELETE FROM cliente WHERE id = $1 RETURNING *", [req.params.id])
        if (deleteCliente.rows.length === 0){
            return res.status(400).json({erro: "Cliente não encontrado"})
        }
        return res.status(200).json("Cliente excluído")
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.post('/carro', async (req,res) =>{
    try {
        const {modelo, placa, ano, idCliente} = req.body;

        const postCarro = await pool.query("INSERT INTO carro (modelo, placa, ano, idCliente) VALUES ($1, $2, $3, $4) RETURNING *", [modelo, placa, ano, idCliente])
        return res.status(200).json(postCarro.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.get('/carro', async (req,res) =>{
    try {
        const getCarro = await pool.query("SELECT * FROM carro")
        return res.status(200).json(getCarro.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.put('/carro/:id', async (req,res) =>{
    try {
        const {modelo, placa, ano, idCliente} = req.body
        const putCarro = await pool.query("UPDATE carro SET modelo = $1, placa = $2, ano = $3, idCliente = $4  WHERE id= $5 RETURNING *", [modelo, placa, ano, idCliente, req.params.id])
        if (putCarro.rows.length === 0){
            return res.status(400).json({erro: "Carro não encontrado"})
        }
        return res.status(200).json(putCarro.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.delete('/carro/:id', async (req, res) =>{
    try {
        const deleteCarro = await pool.query("DELETE FROM carro WHERE id = $1 RETURNING *", [req.params.id])
        if (deleteCarro.rows.length === 0){
            return res.status(400).json({erro: "Carro não existe"})
        }
        return res.status(200).json("Carro excluído")
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.post('/agendamento', async (req, res) =>{
    try {
        const {id_carro, servico, data_agendamento} = req.body;

        const postAgendamento = await pool.query('INSERT INTO agendamento (id_carro, servico, data_agendamento) VALUES ($1, $2, $3) RETURNING *', [id_carro, servico, data_agendamento])
        return res.status(200).json(postAgendamento.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.get('/agendamento', async (req, res) =>{
    try {
        const ordenar = await pool.query(` SELECT
                agendamento.id,
                TO_CHAR(agendamento.data_agendamento, 'YYYY-MM-DD') AS data_agendamento,
                agendamento.servico,
                agendamento.id_carro,
                carro.idCliente,
                cliente.nome AS cliente,
                carro.placa,
                carro.modelo
            FROM agendamento
            JOIN carro ON carro.id = agendamento.id_carro
            JOIN cliente ON cliente.id = carro.idCliente
            ORDER BY agendamento.data_agendamento`)
        return res.status(201).json(ordenar.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.put('/agendamento/:id', async (req,res) =>{
    try {
        const {id_carro, servico, data_agendamento} = req.body
        const putAgendamento = await pool.query("UPDATE agendamento SET id_carro = $1, servico = $2, data_agendamento = $3 WHERE id = $4 RETURNING *", [id_carro, servico, data_agendamento, req.params.id])
        if (putAgendamento.rows.length === 0){
            return res.status(400).json({erro: "Agendamento não encontrado"})
        }
        return res.status(200).json(putAgendamento.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.delete('/agendamento/:id', async (req, res) =>{
    try {
        const deleteAgendamento = await pool.query("DELETE FROM agendamento WHERE id = $1 RETURNING *", [req.params.id])
        if (deleteAgendamento.rows.length === 0){
            return res.status(400).json({erro: "Agendamento não encontrado"})
        }
        return res.status(200).json("Agendamento cancelado.")
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

app.listen(PORT, ()=>{
    console.log(`Server rodando na porta: ${PORT}`)
})
