-- Gestio: script de criação do banco
-- Rodar no MySQL Workbench ou: mysql -u root -p < database/script.sql
-- ATENÇÃO: este script APAGA e recria o banco inteiro.

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS gestio;
CREATE DATABASE gestio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestio;

CREATE TABLE empresas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(120) NOT NULL,
  cnpj       VARCHAR(18)  UNIQUE,
  segmento   VARCHAR(60),
  criado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id  INT          NOT NULL,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  perfil      ENUM('admin', 'funcionario') NOT NULL DEFAULT 'funcionario',
  ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB;

CREATE TABLE clientes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id  INT          NOT NULL,
  nome        VARCHAR(120) NOT NULL,
  cpf_cnpj    VARCHAR(18),
  telefone    VARCHAR(20),
  email       VARCHAR(120),
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB;

CREATE TABLE produtos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id   INT            NOT NULL,
  nome         VARCHAR(120)   NOT NULL,
  preco        DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estoque      INT            NOT NULL DEFAULT 0,
  estoque_min  INT            NOT NULL DEFAULT 0,
  criado_em    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB;

CREATE TABLE vendas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id  INT            NOT NULL,
  cliente_id  INT,
  usuario_id  INT,
  data        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total       DECIMAL(10, 2) NOT NULL DEFAULT 0,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE itens_venda (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  venda_id    INT            NOT NULL,
  produto_id  INT            NOT NULL,
  quantidade  INT            NOT NULL,
  preco_unit  DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (venda_id)   REFERENCES vendas(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB;

CREATE TABLE lancamentos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id  INT            NOT NULL,
  tipo        ENUM('entrada', 'saida') NOT NULL,
  descricao   VARCHAR(160)   NOT NULL,
  valor       DECIMAL(10, 2) NOT NULL,
  vencimento  DATE           NOT NULL,
  status      ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- Dados de exemplo
-- Logins de teste (senha de todos: 123456):
--   admin@gestio.com        administrador da Empresa Demo
--   funcionario@gestio.com  funcionário da Empresa Demo
--   salao@gestio.com        administrador de OUTRA empresa (teste multiempresa)
-- ---------------------------------------------------------------

INSERT INTO empresas (nome, cnpj, segmento) VALUES
  ('Empresa Demo',      '00.000.000/0001-00', 'Comércio'),
  ('Salão Bela Vista',  '11.111.111/0001-11', 'Beleza');

INSERT INTO usuarios (empresa_id, nome, email, senha_hash, perfil) VALUES
  (1, 'Administrador Demo', 'admin@gestio.com',       '$2a$10$P60l4Ls0n2A0h7D5gRYsu.TnDv9/MxYgXbszkJEGA9Vfa5LLMniMG', 'admin'),
  (1, 'Funcionário Demo',   'funcionario@gestio.com', '$2a$10$P60l4Ls0n2A0h7D5gRYsu.TnDv9/MxYgXbszkJEGA9Vfa5LLMniMG', 'funcionario'),
  (2, 'Dona do Salão',      'salao@gestio.com',       '$2a$10$P60l4Ls0n2A0h7D5gRYsu.TnDv9/MxYgXbszkJEGA9Vfa5LLMniMG', 'admin');

INSERT INTO clientes (empresa_id, nome, cpf_cnpj, telefone, email) VALUES
  (1, 'Maria Silva',  '123.456.789-00', '(85) 99999-0001', 'maria@email.com'),
  (1, 'João Pereira', '987.654.321-00', '(85) 99999-0002', 'joao@email.com'),
  (2, 'Ana Souza',    '555.444.333-22', '(85) 98888-0003', 'ana@email.com');

INSERT INTO produtos (empresa_id, nome, preco, estoque, estoque_min) VALUES
  (1, 'Camiseta básica', 39.90, 25, 5),
  (1, 'Boné',            29.90,  3, 5),
  (2, 'Corte de cabelo', 45.00, 99, 0);

INSERT INTO lancamentos (empresa_id, tipo, descricao, valor, vencimento, status) VALUES
  (1, 'saida',   'Aluguel da loja',             1200.00, '2026-11-10', 'pendente'),
  (1, 'saida',   'Compra de mercadoria',         450.00, '2026-11-01', 'pago'),
  (1, 'saida',   'Conta de luz',                 180.00, '2026-11-02', 'pendente'),
  (1, 'entrada', 'Venda a prazo (Maria Silva)',  800.00, '2026-11-15', 'pendente'),
  (1, 'entrada', 'Recebimento de cliente',       300.00, '2026-10-28', 'pago');
