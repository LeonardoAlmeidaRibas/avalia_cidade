const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/avaliacoes'

async function tratarResposta(resposta, mensagem) {
  if (!resposta.ok) {
    let detalhe = ''
    try {
      const corpo = await resposta.json()
      detalhe = corpo.message || corpo.error || ''
    } catch {
      // A resposta pode não conter JSON.
    }
    throw new Error(detalhe || `${mensagem} (HTTP ${resposta.status}).`)
  }
  return resposta.json()
}

export async function listarAvaliacoes(cidadeId) {
  const url = new URL(API_URL, window.location.origin)
  if (cidadeId !== undefined && cidadeId !== null) url.searchParams.set('cidadeId', String(cidadeId))

  let resposta
  try {
    resposta = await fetch(url)
  } catch {
    throw new Error('Não foi possível conectar à API de avaliações. Verifique se o JSON Server está iniciado na porta 3001.')
  }
  return tratarResposta(resposta, 'Erro ao carregar avaliações')
}

export async function cadastrarAvaliacao(avaliacao) {
  let resposta
  try {
    resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avaliacao),
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o JSON Server está iniciado na porta 3001.')
  }
  return tratarResposta(resposta, 'Erro ao cadastrar avaliação')
}
