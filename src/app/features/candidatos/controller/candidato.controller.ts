import { Request, Response } from "express";
import { ApiError } from "../../../shared/errors/api.error";
import { CreateCandidatoUsecase } from "../usecases/create-candidato.usecase";
import { ListCandidatoUsecase } from "../usecases/list-candidatos.usecase";

export class CandidatoController {
  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { nome, usename, password } =
        req.body;

      const result =
        await new CreateCandidatoUsecase().execute(
          req.body
        );

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const result =
        await new ListCandidatoUsecase().execute();

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }
}
