const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001/api/avaliacoes";

async function tratarResposta(resposta) {
  const corpo = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      corpo.message || `Erro HTTP ${resposta.status}.`
    );
  }

  return corpo;
}

export async function listarAvaliacoes(cidadeId) {
  const url = new URL(API_URL);

  if (cidadeId) {
    url.searchParams.set("cidadeId", String(cidadeId));
  }

  try {
    const resposta = await fetch(url);
    return await tratarResposta(resposta);
  } catch (erro) {
    if (erro instanceof TypeError) {
      throw new Error("Não foi possível conectar ao servidor.");
    }

    throw erro;
  }
}

export async function cadastrarAvaliacao(avaliacao, token) {
  if (!token) {
    throw new Error("Você precisa fazer login para avaliar.");
  }

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(avaliacao),
    });

    return await tratarResposta(resposta);
  } catch (erro) {
    if (erro instanceof TypeError) {
      throw new Error("Não foi possível conectar ao servidor.");
    }

    throw erro;
  }
}