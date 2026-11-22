import express from "express";
import cors from "cors";
import { pool } from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import avaliacoesRoutes from "./routes/avaliacoesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/avaliacoes", avaliacoesRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "API AvaliaCidades funcionando!" });
});

app.get("/api/health", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS banco"
    );

    res.json({
      status: "Conectado!",
      banco: resultado.rows[0].banco,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      status: "Erro na conexão com PostgreSQL",
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Servidor iniciado na porta 3001");
});