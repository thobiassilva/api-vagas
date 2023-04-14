import { Router } from "express";
import { checkLoginValidator } from "../../login/validators/check-login.validator";
import { CandidaturaController } from "../controller/candidatura.controller";
import { checkLoginCandidatoValidator } from "../../candidatos/validators/check-login-candidato-validator";

export const candidaturaRoutes = () => {
  const router = Router();

  router.post(
    "/",
    [
      checkLoginValidator,
      checkLoginCandidatoValidator,
    ],
    new CandidaturaController().create
  );

  router.get(
    "/",
    [
      checkLoginValidator,
      checkLoginCandidatoValidator,
    ],
    new CandidaturaController().listCandidaturas
  );

  return router;
};
