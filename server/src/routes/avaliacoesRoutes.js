import { Router } from "express";

import {
  listarAvaliacoes,
  cadastrarAvaliacao,
  excluirAvaliacao,
} from "../controllers/avaliacoesController.js";

import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listarAvaliacoes);
router.post("/", autenticar, cadastrarAvaliacao);
router.delete("/:id", autenticar, excluirAvaliacao);

export default router;