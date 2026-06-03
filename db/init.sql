-- Banco e tabela do catálogo de filmes.
-- Rodado automaticamente pelo MySQL no primeiro boot (docker-entrypoint-initdb.d).

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS catalogo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catalogo;

CREATE TABLE IF NOT EXISTS filmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  descricao TEXT,
  nota DECIMAL(3,1) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO filmes (nome, categoria, descricao, nota) VALUES
  ('Matrix', 'Ficção Científica', 'Um hacker descobre que a realidade é uma simulação e se junta à rebelião contra as máquinas.', 9.5),
  ('Interestelar', 'Ficção Científica', 'Exploradores atravessam um buraco de minhoca em busca de um novo lar para a humanidade.', 9.2),
  ('O Poderoso Chefão', 'Drama', 'A saga da família Corleone e a transição de poder no mundo do crime organizado.', 9.7),
  ('Parasita', 'Suspense', 'Uma família pobre se infiltra na vida de uma família rica, com consequências inesperadas.', 8.9),
  ('Coringa', 'Drama', 'A origem trágica de Arthur Fleck e sua transformação no icônico vilão de Gotham.', 8.5),
  ('Duna', 'Ficção Científica', 'Paul Atreides enfrenta seu destino em um planeta desértico repleto de intrigas e poder.', 8.4);
