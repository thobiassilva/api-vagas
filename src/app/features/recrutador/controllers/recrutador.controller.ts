import { Request, Response } from "express";
import { ApiError } from "../../../shared/errors/api.error";
import { listRecrutadorUsecase } from "../usecases/list-recrutador";
import { CreateRecrutadorUsecase } from "../usecases/create-recrutador.usecase";

export class RecrutadorController {
  public async list(req: Request, res: Response) {
    try {
      const result =
        await new listRecrutadorUsecase().execute();

      return res.status(200).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }

  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const {
        nome,
        username,
        password,
        nomeEmpresa,
      } = req.body;

      // to-do validacao de campos

      const result =
        await new CreateRecrutadorUsecase().execute(
          req.body
        );

      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
}
