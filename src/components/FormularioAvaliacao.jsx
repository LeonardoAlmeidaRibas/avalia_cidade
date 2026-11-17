import { useState } from "react";
import { cadastrarAvaliacao } from "../services/avaliacoesService";

function FormularioAvaliacao({ cidade, onCadastrado }) {
  const [autor, setAutor] = useState("");
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSalvando(true);

    const avaliacao = {
      cidadeId: cidade.id,
      cidade: cidade.nome,
      estado: cidade.estado,
      autor: autor.trim(),
      nota: Number(nota),
      comentario: comentario.trim(),
    };

    try {
      await cadastrarAvaliacao(avaliacao);

      setAutor("");
      setNota(5);
      setComentario("");

      onCadastrado();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="painel">
      <h2>Avaliar {cidade.nome}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="autor">Seu nome</label>
        <input
          id="autor"
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={80}
          required
        />

        <label htmlFor="nota">Nota da cidade</label>
        <select
          id="nota"
          value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
        >
          <option value={5}>5 estrelas - Excelente</option>
          <option value={4}>4 estrelas - Muito boa</option>
          <option value={3}>3 estrelas - Regular</option>
          <option value={2}>2 estrelas - Ruim</option>
          <option value={1}>1 estrela - Péssima</option>
        </select>

        <label htmlFor="comentario">Sua experiência</label>
        <textarea
          id="comentario"
          rows="5"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Conte como foi sua experiência nesta cidade..."
          maxLength={2000}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <button
          type="submit"
          className="botao-principal"
          disabled={salvando}
        >
          {salvando ? "Publicando..." : "Publicar avaliação"}
        </button>
      </form>
    </section>
  );
}

export default FormularioAvaliacao;