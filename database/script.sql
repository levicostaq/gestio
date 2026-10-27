-- Gestio: script de criação do banco
-- Rodar no MySQL Workbench ou: mysql -u root -p < database/script.sql

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

-- Dados de exemplo para desenvolvimento
INSERT INTO empresas (nome, cnpj, segmento) VALUES
  ('Empresa Demo', '00.000.000/0001-00', 'Comércio');

INSERT INTO clientes (empresa_id, nome, cpf_cnpj, telefone, email) VALUES
  (1, 'Maria Silva',  '123.456.789-00', '(85) 99999-0001', 'maria@email.com'),
  (1, 'João Pereira', '987.654.321-00', '(85) 99999-0002', 'joao@email.com');

INSERT INTO produtos (empresa_id, nome, preco, estoque, estoque_min) VALUES
  (1, 'Camiseta básica', 39.90, 25, 5),
  (1, 'Boné',            29.90,  3, 5);
