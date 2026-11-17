function ListaAvaliacoes({ avaliacoes }) {
  if (avaliacoes.length === 0) {
    return (
      <section className="painel">
        <h2>Avaliações</h2>
        <p>Esta cidade ainda não possui avaliações.</p>
      </section>
    );
  }

  const media =
    avaliacoes.reduce(
      (total, avaliacao) => total + Number(avaliacao.nota),
      0
    ) / avaliacoes.length;

  return (
    <section className="painel">
      <h2>Avaliações dos usuários</h2>

      <p>
        <strong>Nota média:</strong> {media.toFixed(1)} / 5
      </p>

      <p>
        Total de avaliações: {avaliacoes.length}
      </p>

      <div className="lista-avaliacoes">
        {avaliacoes.map((avaliacao) => (
          <article
            className="avaliacao"
            key={avaliacao.id}
          >
            <h3>{avaliacao.autor}</h3>

            <p className="estrelas">
              {"★".repeat(Number(avaliacao.nota))}
              {"☆".repeat(5 - Number(avaliacao.nota))}
            </p>

            <p>{avaliacao.comentario}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ListaAvaliacoes;