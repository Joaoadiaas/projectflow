# 🚀 ProjectFlow

**ProjectFlow** é uma aplicação full-stack desenvolvida para demonstrar habilidades práticas em **desenvolvimento Python (FastAPI)** e **front-end com React + TypeScript**.  
O sistema permite gerenciar **clientes, projetos, tarefas e eventos** de forma simples e organizada.

---

## 🧠 Visão Geral

> Projeto criado com o objetivo de consolidar conhecimentos de desenvolvimento full-stack e servir como portfólio técnico para vagas de **Desenvolvedor Júnior Python / Full Stack**.

### 💡 Funcionalidades principais
- 📇 Cadastro e listagem de **clientes**
- 📁 Registro de **projetos** vinculados a clientes
- ✅ Controle de **tarefas (tasks)** com status (`BACKLOG`, `IN_PROGRESS`, `REVIEW`, `DONE`)
- 📅 Gestão de **eventos** (data, local, link)
- 🌐 Integração completa **frontend + backend**
- 🧩 Banco de dados **SQLite** com **SQLAlchemy ORM**
- 🔄 Documentação automática da API com **Swagger (FastAPI Docs)**

---

## 🧰 Tecnologias Utilizadas

### Backend
- 🐍 **Python 3.13**
- ⚡ **FastAPI**
- 🗄️ **SQLAlchemy** + SQLite
- 🧪 **Uvicorn**
- 🔐 **Pydantic** (validação de dados)

### Frontend
- ⚛️ **React** + **TypeScript**
- ⚡ **Vite**
- 🔗 **Axios** (requisições HTTP)
- 🎨 HTML5 + CSS inline simples

### Outros
- 🧱 **Git & GitHub**
- 🧩 **VS Code**
- 💡 **RESTful API architecture**
- 🧩 **CORS Middleware**

---

## ⚙️ Como executar localmente

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/projectflow.git
cd projectflow

🔹 2. Rodar o Backend (FastAPI)
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1  # (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload


A API ficará disponível em:
👉 http://127.0.0.1:8000

👉 Documentação: http://127.0.0.1:8000/docs

🔹 3. Rodar o Frontend (React + Vite)

Em outro terminal:

cd frontend
npm install
npm run dev


A aplicação ficará disponível em:
👉 http://localhost:5173

🧑‍💻 Desenvolvido por

João Pedro Dias