const API_IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades'

export async function buscarCidades() {
  let resposta
  try {
    resposta = await fetch(`${API_IBGE}/municipios`)
  } catch {
    throw new Error('Não foi possível conectar à API do IBGE. Verifique sua conexão com a internet.')
  }

  if (!resposta.ok) throw new Error(`A API do IBGE respondeu com erro (HTTP ${resposta.status}).`)

  const dados = await resposta.json()
  return dados.map((municipio) => {
    const uf = municipio.microrregiao?.mesorregiao?.UF?.sigla
      ?? municipio['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla
      ?? municipio.regiao?.UF?.sigla
      ?? ''
    return { id: municipio.id, nome: municipio.nome, estado: uf }
  }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}
