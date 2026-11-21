import { useState } from 'react'
import { cadastrarAvaliacao } from '../services/avaliacoesService'

const criterios = [
  { id: 'seguranca', nome: 'Segurança', descricao: 'Sensação de segurança no dia a dia' },
  { id: 'transporte', nome: 'Transporte', descricao: 'Mobilidade e transporte público' },
  { id: 'saude', nome: 'Saúde', descricao: 'Acesso a serviços de saúde' },
  { id: 'educacao', nome: 'Educação', descricao: 'Escolas e oportunidades de ensino' },
  { id: 'lazer', nome: 'Lazer', descricao: 'Parques, cultura e atividades' },
  { id: 'infraestrutura', nome: 'Infraestrutura', descricao: 'Limpeza, ruas e serviços urbanos' },
]

function FormularioAvaliacao({ cidade, onCadastrado }) {
  const [autor, setAutor] = useState('')
  const [notas, setNotas] = useState(Object.fromEntries(criterios.map((criterio) => [criterio.id, 5])))
  const [comentario, setComentario] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setSucesso(false)
    if (!autor.trim() || !comentario.trim()) {
      setErro('Preencha seu nome e conte um pouco sobre sua experiência.')
      return
    }

    setSalvando(true)
    const avaliacao = {
      cidadeId: String(cidade.id),
      cidade: cidade.nome,
      estado: cidade.estado,
      autor: autor.trim(),
      notas,
      nota: Number((Object.values(notas).reduce((soma, nota) => soma + Number(nota), 0) / criterios.length).toFixed(1)),
      comentario: comentario.trim(),
      data: new Date().toISOString(),
    }

    try {
      await cadastrarAvaliacao(avaliacao)
      setAutor('')
      setNotas(Object.fromEntries(criterios.map((criterio) => [criterio.id, 5])))
      setComentario('')
      setSucesso(true)
      onCadastrado()
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="painel formulario-painel">
      <div className="painel-titulo"><span className="eyebrow">CONTRIBUA</span><h2>Avalie esta cidade</h2><p>Sua opinião pode ajudar quem está pensando em morar ou visitar.</p></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="autor">Como podemos te chamar?</label>
        <input id="autor" type="text" value={autor} onChange={(event) => setAutor(event.target.value)} placeholder="Seu nome" maxLength={80} required />

        <fieldset className="criterios-fieldset">
          <legend>Como você avalia cada aspecto?</legend>
          <p className="ajuda-form">1 = muito ruim · 5 = excelente</p>
          {criterios.map((criterio) => (
            <div className="criterio-linha" key={criterio.id}>
              <div><strong>{criterio.nome}</strong><small>{criterio.descricao}</small></div>
              <select aria-label={`Nota para ${criterio.nome}`} value={notas[criterio.id]} onChange={(event) => setNotas((atuais) => ({ ...atuais, [criterio.id]: Number(event.target.value) }))}>
                {[5, 4, 3, 2, 1].map((nota) => <option key={nota} value={nota}>{nota} {nota === 1 ? 'estrela' : 'estrelas'}</option>)}
              </select>
            </div>
          ))}
        </fieldset>

        <label htmlFor="comentario">Conte sua experiência</label>
        <textarea id="comentario" rows="4" value={comentario} onChange={(event) => setComentario(event.target.value)} placeholder="O que você gosta na cidade? O que poderia melhorar?" maxLength={2000} required />
        <div className="contador-caracteres">{comentario.length}/2000</div>

        {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
        {sucesso && <p className="mensagem-sucesso" role="status">Avaliação publicada! Obrigado por contribuir.</p>}
        <button type="submit" className="botao-principal" disabled={salvando}>{salvando ? 'Publicando...' : 'Publicar avaliação'}</button>
      </form>
    </section>
  )
}

export default FormularioAvaliacao
