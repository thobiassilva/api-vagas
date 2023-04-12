import { Candidato } from "../../../models/candidato.model";
import { Return } from "../../../shared/util/return.contract";
import { UsuarioRepository } from "../../usuario/database/usuario.repository";

interface CreateCandidatoParams {
  nome: string;
  username: string;
  password: string;
}

export class CreateCandidatoUsecase {
  public async execute(
    data: CreateCandidatoParams
  ): Promise<Return> {
    const repository = new UsuarioRepository();

    const candidato = new Candidato(
      data.nome,
      data.username,
      data.password
    );

    const result = await repository.create(
      candidato
    );

    return {
      ok: false,
      code: 201,
      message: "Usuario criado com sucesso",
      data: result,
    };
  }
}
