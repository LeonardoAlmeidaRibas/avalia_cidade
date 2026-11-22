import { Router } from "express";

import {
  listarAvaliacoes,
  cadastrarAvaliacao,
} from "../controllers/avaliacoesController.js";

import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listarAvaliacoes);
router.post("/", autenticar, cadastrarAvaliacao);

export default router;