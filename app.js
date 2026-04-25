require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres123",
  database: process.env.DB_NAME || "appdb",
  port: process.env.DB_PORT || 5432,
});

// Teste de conexão
pool.connect()
  .then(() => console.log("Conectado ao banco"))
  .catch(err => console.error("Erro ao conectar no banco:", err));


// CREATE
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email } = req.body;

    const result = await pool.query(
      "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// READ
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// UPDATE
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    const result = await pool.query(
      "UPDATE usuarios SET nome=$1, email=$2 WHERE id=$3 RETURNING *",
      [nome, email, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// DELETE
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM usuarios WHERE id=$1", [id]);

    res.json({ mensagem: "Deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.listen(3000, () => console.log("API rodando na porta 3000"));