import { useState } from 'react'
import { excluirAvaliacao } from '../services/avaliacoesService'

const criterios = [
  { id: 'seguranca', nome: 'Segurança' },
  { id: 'transporte', nome: 'Transporte' },
  { id: 'saude', nome: 'Saúde' },
  { id: 'educacao', nome: 'Educação' },
  { id: 'lazer', nome: 'Lazer' },
  { id: 'infraestrutura', nome: 'Infraestrutura' },
]

function notaDaAvaliacao(avaliacao) {
  if (avaliacao.notas) {
    const notas = Object.values(avaliacao.notas).map(Number)

    return notas.length
      ? notas.reduce((soma, nota) => soma + nota, 0) / notas.length
      : Number(avaliacao.nota) || 0
  }

  return Number(avaliacao.nota) || 0
}

function formatarData(data) {
  if (!data) return ''

  const dataValida = new Date(data)

  return Number.isNaN(dataValida.getTime())
    ? ''
    : dataValida.toLocaleDateString('pt-BR')
}

function ListaAvaliacoes({ avaliacoes, sessao, onExcluida }) {
  const [excluindoId, setExcluindoId] = useState(null)
  const [erroExclusao, setErroExclusao] = useState('')

  async function handleExcluir(avaliacao) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir esta avaliação?'
    )

    if (!confirmar) return

    setErroExclusao('')
    setExcluindoId(avaliacao.id)

    try {
      await excluirAvaliacao(avaliacao.id, sessao.token)

      if (onExcluida) {
        onExcluida(avaliacao.id)
      }
    } catch (erro) {
      setErroExclusao(erro.message || 'Erro ao excluir avaliação.')
    } finally {
      setExcluindoId(null)
    }
  }

  if (!avaliacoes.length) {
    return (
      <section className="painel lista-painel">
        <div className="painel-titulo">
          <span className="eyebrow">COMUNIDADE</span>
          <h2>O que estão dizendo</h2>
        </div>

        <div className="sem-avaliacoes">
          <span>✎</span>
          <h3>Esta cidade ainda não tem avaliações</h3>
          <p>
            Se você conhece o município, seja a primeira pessoa
            a compartilhar sua experiência.
          </p>
        </div>
      </section>
    )
  }

  const media =
    avaliacoes.reduce(
      (total, avaliacao) => total + notaDaAvaliacao(avaliacao),
      0
    ) / avaliacoes.length

  const mediasCriterios = criterios.map((criterio) => {
    const notas = avaliacoes
      .filter(
        (avaliacao) =>
          avaliacao.notas?.[criterio.id] !== undefined
      )
      .map((avaliacao) => Number(avaliacao.notas[criterio.id]))

    return {
      ...criterio,
      media: notas.length
        ? notas.reduce((soma, nota) => soma + nota, 0) / notas.length
        : null,
    }
  })

  return (
    <section className="painel lista-painel">
      <div className="painel-titulo">
        <span className="eyebrow">COMUNIDADE</span>
        <h2>O que estão dizendo</h2>
        <p>Opiniões compartilhadas por quem conhece a cidade.</p>
      </div>

      <div className="resumo-avaliacoes">
        <div className="media-grande">
          <strong>{media.toFixed(1)}</strong>

          <span className="estrelas" aria-label={`${media.toFixed(1)} de 5 estrelas`}>
            ★ ★ ★ ★ ★
          </span>

          <small>
            {avaliacoes.length}{' '}
            {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
          </small>
        </div>

        <div className="medias-criterios">
          {mediasCriterios.map((criterio) => (
            <div className="media-criterio" key={criterio.id}>
              <span>{criterio.nome}</span>
              <strong>
                {criterio.media === null
                  ? '—'
                  : criterio.media.toFixed(1)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {erroExclusao && (
        <div className="mensagem-erro erro-exclusao">
          {erroExclusao}
        </div>
      )}

      <div className="lista-avaliacoes">
        {[...avaliacoes]
          .sort(
            (a, b) =>
              new Date(b.data || 0) - new Date(a.data || 0)
          )
          .map((avaliacao, indice) => {
            const nota = notaDaAvaliacao(avaliacao)

            const ehAutor =
              sessao?.usuario?.id != null &&
              Number(avaliacao.usuarioId) ===
                Number(sessao.usuario.id)

            const estaExcluindo =
              excluindoId === avaliacao.id

            return (
              <article
                className="avaliacao"
                key={avaliacao.id ?? `${avaliacao.autor}-${indice}`}
              >
                <div className="avaliacao-topo">
                  <div className="avatar-autor">
                    {(avaliacao.autor || '?')
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="autor-info">
                    <h3>{avaliacao.autor || 'Anônimo'}</h3>
                    <small>
                      {formatarData(avaliacao.data) ||
                        'Avaliação registrada'}
                    </small>
                  </div>

                  <span className="nota-pill">
                    ★ {nota.toFixed(1)}
                  </span>

                  {ehAutor && (
                    <button
                      type="button"
                      className="botao-excluir-avaliacao"
                      onClick={() => handleExcluir(avaliacao)}
                      disabled={estaExcluindo}
                      title="Excluir sua avaliação"
                    >
                      {estaExcluindo ? 'Excluindo...' : 'Excluir'}
                    </button>
                  )}
                </div>

                <p className="comentario-avaliacao">
                  {avaliacao.comentario}
                </p>

                {avaliacao.notas && (
                  <div className="tags-notas">
                    {criterios
                      .filter(
                        (criterio) =>
                          avaliacao.notas[criterio.id] !== undefined
                      )
                      .map((criterio) => (
                        <span key={criterio.id}>
                          {criterio.nome}:{' '}
                          <strong>
                            {avaliacao.notas[criterio.id]}/5
                          </strong>
                        </span>
                      ))}
                  </div>
                )}
              </article>
            )
          })}
      </div>
    </section>
  )
}

export default ListaAvaliacoes