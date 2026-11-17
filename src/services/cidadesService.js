const API_IBGE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export async function buscarCidades() {
    // usa fetch() para consultar a API do IBGE
    // e transforma a resposta em objetos mais simples, com id, nome e estado.
  const resposta = await fetch(`${API_IBGE}/municipios`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as cidades.");
  }

  const dados = await resposta.json();

  return dados.map((municipio) => {
    const uf =
      municipio.microrregiao?.mesorregiao?.UF?.sigla ??
      municipio["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla ??
      "";

    return {
      id: municipio.id,
      nome: municipio.nome,
      estado: uf,
    };
  }).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}