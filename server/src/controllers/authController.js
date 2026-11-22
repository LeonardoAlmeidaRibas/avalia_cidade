import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database/db.js";

function gerarToken(usuario) {
  return jwt.sign(
    {
      sub: String(usuario.id),
      nickname: usuario.nickname,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

export async function cadastrar(req, res) {
  const nickname = String(req.body.nickname || "").trim();
  const senha = String(req.body.senha || "");

  if (nickname.length < 3 || nickname.length > 30) {
    return res.status(400).json({
      message: "O nickname deve ter entre 3 e 30 caracteres.",
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 6 caracteres.",
    });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nickname, senha_hash)
       VALUES ($1, $2)
       RETURNING id, nickname`,
      [nickname, senhaHash]
    );

    const usuario = resultado.rows[0];
    const token = gerarToken(usuario);

    return res.status(201).json({
      message: "Conta criada com sucesso!",
      usuario,
      token,
    });
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({
        message: "Esse nickname já está em uso.",
      });
    }

    console.error(erro);

    return res.status(500).json({
      message: "Erro ao cadastrar usuário.",
    });
  }
}

export async function login(req, res) {
  const nickname = String(req.body.nickname || "").trim();
  const senha = String(req.body.senha || "");

  try {
    const resultado = await pool.query(
      `SELECT id, nickname, senha_hash
       FROM usuarios
       WHERE LOWER(nickname) = LOWER($1)`,
      [nickname]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        message: "Nickname ou senha incorretos.",
      });
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        message: "Nickname ou senha incorretos.",
      });
    }

    const token = gerarToken(usuario);

    return res.json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nickname: usuario.nickname,
      },
      token,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      message: "Erro ao realizar login.",
    });
  }
}