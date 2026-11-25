import { useMemo, useState } from 'react'

function PesquisaCidade({ cidades, onSelecionar, cidadeSelecionada }) {
  const [pesquisa, setPesquisa] = useState('')
  const [aberto, setAberto] = useState(false)

  const cidadesFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase('pt-BR')
    if (!termo) return []
    return cidades.filter((cidade) =>
      `${cidade.nome} ${cidade.estado}`.toLocaleLowerCase('pt-BR').includes(termo)
    ).slice(0, 12)
  }, [cidades, pesquisa])

  function escolher(cidade) {
    onSelecionar(cidade)
    setPesquisa('')
    setAberto(false)
  }

  return (
    <div className="busca-wrapper">
      <div className="campo-busca">
        <span className="busca-icone" aria-hidden="true">⌕</span>
        <input
          type="text"
          aria-label="Pesquisar cidade ou estado"
          aria-expanded={aberto && Boolean(pesquisa.trim())}
          placeholder="Ex.: Ponta Grossa ou PR"
          value={pesquisa}
          onFocus={() => setAberto(true)}
          onChange={(event) => { setPesquisa(event.target.value); setAberto(true) }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setAberto(false)
            if (event.key === 'Enter' && cidadesFiltradas.length === 1) escolher(cidadesFiltradas[0])
          }}
        />
        {pesquisa && <button className="limpar-busca" type="button" onClick={() => setPesquisa('')} aria-label="Limpar busca">×</button>}
      </div>
      {aberto && pesquisa.trim() && (
        <div className="resultados" role="listbox" aria-label="Resultados da pesquisa">
          {cidadesFiltradas.length ? cidadesFiltradas.map((cidade) => (
            <button key={cidade.id} type="button" role="option" aria-selected={cidadeSelecionada?.id === cidade.id} onClick={() => escolher(cidade)}>
              <span className="resultado-pin">⌖</span><span>{cidade.nome}</span><small>{cidade.estado}</small>
            </button>
          )) : <p className="sem-resultados">Nenhuma cidade encontrada. Confira a digitação.</p>}
        </div>
      )}
      {cidadeSelecionada && <p className="cidade-atual">Cidade selecionada: <strong>{cidadeSelecionada.nome} - {cidadeSelecionada.estado}</strong></p>}
    </div>
  )
}

export default PesquisaCidade
