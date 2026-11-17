import { useState } from "react";

function PesquisaCidade({ cidades, onSelecionar }) {
  const [pesquisa, setPesquisa] = useState("");

  const cidadesFiltradas = pesquisa.trim()
    ? cidades
        .filter((cidade) =>
          `${cidade.nome} ${cidade.estado}`
            .toLowerCase()
            .includes(pesquisa.trim().toLowerCase())
        )
        .slice(0, 15)
    : [];

  return (
    <section className="painel">
      <h2>Encontre uma cidade</h2>

      <input
        type="text"
        placeholder="Digite o nome da cidade..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {cidadesFiltradas.length > 0 && (
        <div className="resultados">
          {cidadesFiltradas.map((cidade) => (
            <button
              key={cidade.id}
              type="button"
              onClick={() => {
                onSelecionar(cidade);
                setPesquisa("");
              }}
            >
              {cidade.nome} - {cidade.estado}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default PesquisaCidade;