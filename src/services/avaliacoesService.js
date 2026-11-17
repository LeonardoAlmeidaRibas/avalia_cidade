const API_URL = "http://localhost:3001/avaliacoes";

export async function listarAvaliacoes(cidadeId) {
  const url = new URL(API_URL);

  if (cidadeId !== undefined && cidadeId !== null) {
    url.searchParams.set("cidadeId", String(cidadeId));
  }

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao carregar avaliações.");
  }

  return await resposta.json();
}

export async function cadastrarAvaliacao(avaliacao) {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(avaliacao),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao cadastrar avaliação.");
  }

  return await resposta.json();
}
