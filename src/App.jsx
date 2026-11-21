import { useEffect, useMemo, useState } from 'react'
import './App.css'
import FormularioAvaliacao from './components/FormularioAvaliacao'
import ListaAvaliacoes from './components/ListaAvaliacoes'
import PesquisaCidade from './components/PesquisaCidade'
import { listarAvaliacoes } from './services/avaliacoesService'
import { buscarCidades } from './services/cidadesService'

function App() {
  const [cidades, setCidades] = useState([])
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregandoCidades, setCarregandoCidades] = useState(true)
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false)
  const [erroCidades, setErroCidades] = useState('')
  const [erroAvaliacoes, setErroAvaliacoes] = useState('')
  const [atualizacao, setAtualizacao] = useState(0)

  useEffect(() => {
    let ativo = true

    async function carregarCidades() {
      try {
        const dados = await buscarCidades()
        if (ativo) setCidades(dados)
      } catch (error) {
        if (ativo) setErroCidades(error.message)
      } finally {
        if (ativo) setCarregandoCidades(false)
      }
    }

    carregarCidades()
    return () => { ativo = false }
  }, [])

  useEffect(() => {
    let ativo = true

    async function carregarAvaliacoes() {
      if (!cidadeSelecionada) return
      try {
        const dados = await listarAvaliacoes(cidadeSelecionada.id)
        if (ativo) setAvaliacoes(dados)
      } catch (error) {
        if (ativo) {
          setErroAvaliacoes(error.message)
          setAvaliacoes([])
        }
      } finally {
        if (ativo) setCarregandoAvaliacoes(false)
      }
    }

    carregarAvaliacoes()
    return () => { ativo = false }
  }, [cidadeSelecionada, atualizacao])

  const mediaGeral = useMemo(() => {
    if (!avaliacoes.length) return null
    const notas = avaliacoes.map((avaliacao) => {
      if (avaliacao.notas) {
        const valores = Object.values(avaliacao.notas).map(Number)
        return valores.length ? valores.reduce((soma, nota) => soma + nota, 0) / valores.length : Number(avaliacao.nota) || 0
      }
      return Number(avaliacao.nota)
    })
    return notas.reduce((soma, nota) => soma + nota, 0) / notas.length
  }, [avaliacoes])

  function selecionarCidade(cidade) {
    if (cidadeSelecionada?.id === cidade.id) return
    setCidadeSelecionada(cidade)
    setAvaliacoes([])
    setErroAvaliacoes('')
    setCarregandoAvaliacoes(true)
  }

  function recarregarAvaliacoes() {
    setErroAvaliacoes('')
    setCarregandoAvaliacoes(true)
    setAtualizacao((valor) => valor + 1)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="marca" href="#inicio" aria-label="AvaliaCidades - início">
          <span className="marca-icone">A</span>
          <span>Avalia<span className="marca-destaque">Cidades</span></span>
        </a>
        <a className="link-sobre" href="#sobre">Sobre o projeto</a>
      </header>

      <main id="inicio">
        <section className="hero-section">
          <div className="hero-conteudo">
            <span className="eyebrow">SUA EXPERIÊNCIA FAZ A DIFERENÇA</span>
            <h1>Conheça cidades.<br /><span>Avalie experiências.</span></h1>
            <p>Descubra o que as pessoas pensam sobre os municípios brasileiros e compartilhe sua visão sobre a cidade.</p>
            <a className="hero-cta" href="#buscar">Explorar cidades <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-ilustracao" aria-hidden="true">
            <div className="sol" />
            <div className="predio predio-um" /><div className="predio predio-dois" />
            <div className="predio predio-tres" /><div className="predio predio-quatro" />
            <div className="arvore arvore-um" /><div className="arvore arvore-dois" />
            <div className="chao" />
            <div className="cartao-flutuante"><span>★</span><strong>5.0</strong><small>Voz da comunidade</small></div>
          </div>
        </section>

        <section className="conteudo-principal" id="buscar">
          <div className="secao-intro">
            <span className="eyebrow">COMECE POR AQUI</span>
            <h2>Qual cidade você quer conhecer?</h2>
            <p>Pesquise pelo nome do município ou pela sigla do estado.</p>
          </div>

          {carregandoCidades && <div className="aviso"><span className="spinner" /> Carregando municípios do IBGE...</div>}
          {erroCidades && <div className="mensagem-erro" role="alert">{erroCidades} <button type="button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}
          {!carregandoCidades && !erroCidades && (
            <PesquisaCidade cidades={cidades} onSelecionar={selecionarCidade} cidadeSelecionada={cidadeSelecionada} />
          )}

          {cidadeSelecionada ? (
            <>
              <section className="cidade-cabecalho">
                <div>
                  <span className="eyebrow">VOCÊ ESTÁ EXPLORANDO</span>
                  <h2>{cidadeSelecionada.nome}<span className="uf-tag">{cidadeSelecionada.estado}</span></h2>
                  <p>Compartilhe sua experiência e ajude outras pessoas a conhecer melhor o município.</p>
                </div>
                <div className="cidade-nota">
                  <span className="nota-estrela">★</span>
                  <strong>{mediaGeral === null ? '—' : mediaGeral.toFixed(1)}</strong>
                  <small>{avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}</small>
                </div>
              </section>

              {erroAvaliacoes && <div className="mensagem-erro" role="alert">{erroAvaliacoes}<button type="button" onClick={recarregarAvaliacoes}>Tentar novamente</button></div>}
              <div className="colunas">
                <div className="coluna-lista">
                  {carregandoAvaliacoes ? <div className="aviso"><span className="spinner" /> Carregando avaliações...</div> : <ListaAvaliacoes avaliacoes={avaliacoes} />}
                </div>
                <div className="coluna-formulario">
                  <FormularioAvaliacao cidade={cidadeSelecionada} onCadastrado={recarregarAvaliacoes} />
                </div>
              </div>
            </>
          ) : (
            <div className="estado-inicial">
              <div className="estado-icone">⌖</div>
              <h3>Uma cidade de cada vez</h3>
              <p>Escolha um município na busca para visualizar as avaliações e registrar a sua.</p>
            </div>
          )}
        </section>

        <section className="sobre-section" id="sobre">
          <div><span className="eyebrow">SOBRE O AVALIACIDADES</span><h2>Uma cidade é feita de muitas experiências.</h2></div>
          <p>O AvaliaCidades é um projeto acadêmico que reúne opiniões de pessoas sobre municípios brasileiros. As cidades são consultadas na API de Localidades do IBGE e as avaliações são armazenadas em uma API REST.</p>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} AvaliaCidades</span><span>Feito para compartilhar experiências.</span></footer>
    </div>
  )
}

export default App
