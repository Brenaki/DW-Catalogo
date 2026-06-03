const mysql = require('mysql2/promise');

// Pool reusa conexões abertas — evita handshake por request.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'catalogo',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// MySQL no compose demora a aceitar conexões. Tenta com backoff antes de subir a API.
async function waitForDb(retries = 15, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('Conectado ao MySQL.');
      return;
    } catch (err) {
      console.log(`Aguardando MySQL (${i}/${retries})... ${err.code || err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Não foi possível conectar ao MySQL após várias tentativas.');
}

module.exports = { pool, waitForDb };
