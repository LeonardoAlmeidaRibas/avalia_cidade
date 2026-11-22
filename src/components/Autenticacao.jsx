import { useState } from "react";
import {
  cadastrarUsuario,
  loginUsuario,
} from "../services/authService";

function Autenticacao({ modoInicial, onFechar, onAutenticado }) {
  const [modo, setModo] = useState(modoInicial);
  const [nickname, setNickname] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const dados = { nickname: nickname.trim(), senha };

      const resultado =
        modo === "cadastro"
          ? await cadastrarUsuario(dados)
          : await loginUsuario(dados);

      onAutenticado(resultado);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-overlay">
      <section className="auth-card">
        <button
          className="auth-fechar"
          type="button"
          onClick={onFechar}
        >
          ×
        </button>

        <span className="eyebrow">AVALIACIDADES</span>

        <h2>
          {modo === "cadastro"
            ? "Crie sua conta"
            : "Bem-vindo de volta"}
        </h2>

        <p>
          {modo === "cadastro"
            ? "Participe da comunidade e compartilhe suas experiências."
            : "Entre para publicar suas avaliações."}
        </p>

        <div className="auth-abas">
          <button
            type="button"
            className={modo === "login" ? "ativa" : ""}
            onClick={() => {
              setModo("login");
              setErro("");
            }}
          >
            Entrar
          </button>

          <button
            type="button"
            className={modo === "cadastro" ? "ativa" : ""}
            onClick={() => {
              setModo("cadastro");
              setErro("");
            }}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nickname">Nickname</label>

          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Seu nickname"
            minLength={3}
            maxLength={30}
            required
          />

          <label htmlFor="senha">Senha</label>

          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Sua senha"
            minLength={6}
            required
          />

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="botao-principal"
            disabled={carregando}
          >
            {carregando
              ? "Aguarde..."
              : modo === "cadastro"
                ? "Criar conta"
                : "Entrar"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Autenticacao;