const API = '/api/filmes';

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const contador = document.getElementById('contador');
const form = document.getElementById('form');
const submitBtn = document.getElementById('submit-btn');
const formError = document.getElementById('form-error');

// Escapa texto antes de injetar no DOM (evita HTML injection).
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function mostrarErro(msg) {
  formError.textContent = msg;
  formError.hidden = !msg;
}

// Cria o elemento de um card de filme.
function criarCard(filme) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.dataset.id = filme.id;

  const nota = Number(filme.nota).toFixed(1);
  card.innerHTML = `
    <span class="movie-nota">★ ${esc(nota)}</span>
    <span class="movie-categoria">${esc(filme.categoria)}</span>
    <h3 class="movie-nome">${esc(filme.nome)}</h3>
    <p class="movie-descricao">${esc(filme.descricao) || 'Sem descrição.'}</p>
    <div class="movie-footer">
      <button class="btn-delete" type="button">Excluir</button>
    </div>
  `;

  card.querySelector('.btn-delete').addEventListener('click', () => excluir(filme.id));
  return card;
}

function render(filmes) {
  grid.innerHTML = '';
  empty.hidden = filmes.length > 0;
  filmes.forEach((f) => grid.appendChild(criarCard(f)));
  contador.textContent = `${filmes.length} ${filmes.length === 1 ? 'filme' : 'filmes'}`;
}

// GET — lista filmes
async function carregar() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Falha ao carregar.');
    render(await res.json());
  } catch (err) {
    grid.innerHTML = '<p class="movie-descricao">Erro ao carregar o catálogo.</p>';
    console.error(err);
  }
}

// POST — cadastra filme
async function cadastrar(dados) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.erro || 'Erro ao cadastrar.');
  }
  return res.json();
}

// DELETE — exclui filme
async function excluir(id) {
  if (!confirm('Excluir este filme do catálogo?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('Erro ao excluir.');
    carregar();
  } catch (err) {
    alert(err.message);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarErro('');

  const dados = {
    nome: form.nome.value.trim(),
    categoria: form.categoria.value.trim(),
    descricao: form.descricao.value.trim(),
    nota: form.nota.value,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';
  try {
    await cadastrar(dados);
    form.reset();
    await carregar();
  } catch (err) {
    mostrarErro(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Adicionar ao catálogo';
  }
});

carregar();
