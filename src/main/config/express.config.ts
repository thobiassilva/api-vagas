import cors from "cors";
import express from "express";
import { recrutadorRoutes } from "../../app/features/recrutador/routes/recrutador.routes";
import { loginRoutes } from "../../app/features/login/routes/login.routes";
import { Candidato } from "../../app/models/candidato.model";
import { candidatoRoutes } from "../../app/features/candidatos/routes/candidato.routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/recrutador", recrutadorRoutes());
  app.use("/candidato", candidatoRoutes());
  app.use("/auth", loginRoutes());

  return app;
};
