import { Router } from "express";
import { checkLoginValidator } from "../../login/validators/check-login.validator";
import { VagaController } from "../controller/vaga.controller";
import { checkLoginRecrutadorValidator } from "../../recrutador/validators/check-login-recrutador";

export const vagaRoutes = () => {
  const router = Router();

  router.get("/", new VagaController().list);
  router.post(
    "/",
    [
      checkLoginValidator,
      checkLoginRecrutadorValidator,
    ],
    new VagaController().create
  );

  return router;
};
