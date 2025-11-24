# 💊 Sistema de Gestão de Farmácia (Full Stack)

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

## 💻 Sobre o projeto

O **PharmaSystem** (escolha um nome para seu projeto) é uma aplicação Web completa desenvolvida para gerenciar o fluxo de uma farmácia. O projeto foi criado para resolver a necessidade de controle de estoque e vendas, com foco na segurança e na distinção de níveis de acesso.

O maior diferencial deste projeto é o **Controle de Acesso (RBAC)**, onde a interface e as funcionalidades mudam dinamicamente dependendo se o usuário logado é um **Cliente** ou um **Gerente**.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação e Segurança
- Login e Cadastro de usuários.
- Autenticação via Token (JWT).
- Proteção de rotas (apenas usuários logados acessam certas áreas).

### 👨‍💼 Perfil Gerente (Admin)
- **Dashboard:** Visão geral do estoque.
- **Gestão de Produtos:** Adicionar, editar e remover medicamentos do sistema.
- **Controle:** Visualização de usuários cadastrados.

### 👤 Perfil Cliente
- **Catálogo:** Visualização de produtos disponíveis com busca e filtros.
- **Carrinho de Compras:** Adição de itens e simulação de compra.
- **Perfil:** Visualização de dados pessoais.

---

## 🎨 Layout

> **Dica:** Coloque aqui prints das telas ou um GIF do sistema funcionando. Isso valoriza muito!

![Login Screen](insira_link_da_imagem_aqui)
![Dashboard Screen](insira_link_da_imagem_aqui)

---

## 🛠 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

### Front-end
- **[React]**: Biblioteca para construção de interfaces.
- **[Axios]**: Para consumo da API.
- **[Styled Components / CSS Modules]**: Para estilização.
- **[React Router]**: Para navegação entre páginas.

### Back-end
- **[Node.js]**: Ambiente de execução Javascript.
- **[Express]**: Framework para criação da API.
- **[Banco de Dados]**: (Coloque aqui: MySQL, PostgreSQL, MongoDB, etc).
- **[JWT]**: Para autenticação segura.

---
