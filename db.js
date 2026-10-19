import { Pool } from 'pg'

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "senai",
    port: 5432,
    database: "TREINO_SAEP"
})

export default pool