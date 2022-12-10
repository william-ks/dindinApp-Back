create database dindin;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  description TEXT,
  value INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT NOW(),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(7) NOT NULL
);

insert into categories (name) 
values ('alimentacao'), ('assinaturas e servicos'), 
('casa'), ('mercado'), ('cuidado pessoais'), ('educacao'),
('familia'), ('lazer'), ('pets'), ('presentes'), ('roupas'),
('saude'), ('transporte'), ('salario'), ('vendas'), ('outras receitas'), ('outras despesas');