const path = require('path');
const express = require('express');
const cors = require('cors');
const { pool, waitForDb } = require('./db');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// GET — lista todos os filmes (mais recentes primeiro)
app.get('/api/filmes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM filmes ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/filmes', err);
    res.status(500).json({ erro: 'Erro ao listar filmes.' });
  }
});

// POST — cria um filme
app.post('/api/filmes', async (req, res) => {
  const { nome, categoria, descricao, nota } = req.body || {};

  if (!nome || !nome.trim() || !categoria || !categoria.trim()) {
    return res.status(400).json({ erro: 'Nome e categoria são obrigatórios.' });
  }
  if (nome.trim().length > 150) {
    return res.status(400).json({ erro: 'Nome deve ter no máximo 150 caracteres.' });
  }
  if (categoria.trim().length > 80) {
    return res.status(400).json({ erro: 'Categoria deve ter no máximo 80 caracteres.' });
  }
  if (descricao && descricao.trim().length > 500) {
    return res.status(400).json({ erro: 'Descrição deve ter no máximo 500 caracteres.' });
  }
  const notaNum = nota === '' || nota == null ? 0 : Number(nota);
  if (Number.isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
    return res.status(400).json({ erro: 'Nota deve ser um número entre 0 e 10.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO filmes (nome, categoria, descricao, nota) VALUES (?, ?, ?, ?)',
      [nome.trim(), categoria.trim(), (descricao || '').trim(), notaNum]
    );
    const [rows] = await pool.query('SELECT * FROM filmes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/filmes', err);
    res.status(500).json({ erro: 'Erro ao cadastrar filme.' });
  }
});

// DELETE — exclui um filme por id
app.delete('/api/filmes/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }
  try {
    const [result] = await pool.query('DELETE FROM filmes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Filme não encontrado.' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/filmes/:id', err);
    res.status(500).json({ erro: 'Erro ao excluir filme.' });
  }
});

async function start() {
  await waitForDb();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Falha ao iniciar:', err);
  process.exit(1);
});
