import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: "TREINO_SAEP"
})

export default pool