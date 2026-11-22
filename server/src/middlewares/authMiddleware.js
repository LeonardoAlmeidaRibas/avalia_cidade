import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Você precisa fazer login.",
    });
  }

  const token = cabecalho.split(" ")[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: dados.sub,
      nickname: dados.nickname,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Sessão inválida ou expirada.",
    });
  }
}