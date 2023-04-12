import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ApiError } from "../../../shared/errors/api.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UsuarioRepository } from "../../usuario/database/usuario.repository";

export class CreateCandidatoValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, username, password } =
        req.body;
      if (!nome) {
        return RequestError.fieldNotProvided(
          res,
          "Nome"
        );
      }
      if (!username) {
        return RequestError.fieldNotProvided(
          res,
          "Username"
        );
      }
      if (!password) {
        return RequestError.fieldNotProvided(
          res,
          "Password"
        );
      }

      const repository = new UsuarioRepository();
      const usuario =
        await repository.getByUsername(username);

      if (usuario !== null) {
        return RequestError.invalidData(
          res,
          "Username já existe"
        );
      }

      next();
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }
}
