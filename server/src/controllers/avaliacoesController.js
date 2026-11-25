import { pool } from "../database/db.js";

const criterios = [
  "seguranca",
  "transporte",
  "saude",
  "educacao",
  "lazer",
  "infraestrutura",
];

export async function listarAvaliacoes(req, res) {
  try {
    const { cidadeId } = req.query;

    let resultado;

    const consulta = `
      SELECT
        a.id,
        a.cidade_id AS "cidadeId",
        a.cidade,
        a.estado,
        a.usuario_id AS "usuarioId",
        u.nickname AS autor,
        a.notas,
        a.nota,
        a.comentario,
        a.data
      FROM avaliacoes a
      JOIN usuarios u ON u.id = a.usuario_id
    `;

    if (cidadeId) {
      const id = Number(cidadeId);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Identificador de cidade inválido.",
        });
      }

      resultado = await pool.query(
        consulta + `
          WHERE a.cidade_id = $1
          ORDER BY a.data DESC
        `,
        [id]
      );
    } else {
      resultado = await pool.query(
        consulta + " ORDER BY a.data DESC"
      );
    }

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      message: "Erro ao carregar avaliações.",
    });
  }
}

export async function cadastrarAvaliacao(req, res) {
  try {
    const cidadeId = Number(req.body.cidadeId);
    const cidade = String(req.body.cidade || "").trim();
    const estado = String(req.body.estado || "").trim().toUpperCase();
    const comentario = String(req.body.comentario || "").trim();
    const notasRecebidas = req.body.notas || {};

    if (!Number.isInteger(cidadeId) || cidadeId <= 0) {
      return res.status(400).json({
        message: "Cidade inválida.",
      });
    }

    if (!cidade || estado.length !== 2) {
      return res.status(400).json({
        message: "Informe uma cidade e um estado válidos.",
      });
    }

    if (!comentario || comentario.length > 2000) {
      return res.status(400).json({
        message: "O comentário é obrigatório e deve ter até 2000 caracteres.",
      });
    }

    const notasValidas = criterios.every((criterio) => {
      const valor = Number(notasRecebidas[criterio]);

      return Number.isInteger(valor) && valor >= 1 && valor <= 5;
    });

    if (!notasValidas) {
      return res.status(400).json({
        message: "Informe notas válidas para todos os critérios.",
      });
    }

    const notas = Object.fromEntries(
      criterios.map((criterio) => [
        criterio,
        Number(notasRecebidas[criterio]),
      ])
    );

    const nota = Number(
      (
        Object.values(notas).reduce((soma, valor) => soma + valor, 0) /
        criterios.length
      ).toFixed(1)
    );

    const resultado = await pool.query(
      `INSERT INTO avaliacoes
        (cidade_id, cidade, estado, usuario_id, notas, nota, comentario)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
       RETURNING
         id,
         cidade_id AS "cidadeId",
         cidade,
         estado,
         notas,
         nota,
         comentario,
         data`,
      [
        cidadeId,
        cidade,
        estado,
        req.usuario.id,
        JSON.stringify(notas),
        nota,
        comentario,
      ]
    );

    res.status(201).json({
      ...resultado.rows[0],
      autor: req.usuario.nickname,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      message: "Erro ao publicar avaliação.",
    });
  }
}

export async function excluirAvaliacao(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identificador de avaliação inválido.",
      });
    }

    const resultado = await pool.query(
      `DELETE FROM avaliacoes
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [id, req.usuario.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        message: "Avaliação não encontrada ou você não tem permissão para excluí-la.",
      });
    }

    res.status(200).json({
      message: "Avaliação excluída com sucesso.",
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      message: "Erro ao excluir avaliação.",
    });
  }
}