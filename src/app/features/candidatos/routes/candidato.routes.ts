import { Router } from "express";
import { CandidatoController } from "../controller/candidato.controller";
import { CreateCandidatoValidator } from "../validators/create-candidato-validator";

export const candidatoRoutes = () => {
  const router = Router();

  router.post(
    "/",
    [CreateCandidatoValidator.validate],
    new CandidatoController().create
  );
  router.get("/", new CandidatoController().list);

  return router;
};
