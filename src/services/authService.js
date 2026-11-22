const API_URL = "http://localhost:3001/api/auth";

async function requisicao(endpoint, dados) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.message || "Erro na autenticação.");
  }

  return resultado;
}

export function cadastrarUsuario(dados) {
  return requisicao("cadastro", dados);
}

export function loginUsuario(dados) {
  return requisicao("login", dados);
}

export function obterSessao() {
  try {
    return JSON.parse(localStorage.getItem("avaliaCidadesSessao"));
  } catch {
    return null;
  }
}

export function salvarSessao(dados) {
  const sessao = {
    usuario: dados.usuario,
    token: dados.token,
  };

  localStorage.setItem("avaliaCidadesSessao", JSON.stringify(sessao));

  return sessao;
}

export function removerSessao() {
  localStorage.removeItem("avaliaCidadesSessao");
}