import { Candidato } from "../../../models/candidato.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
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
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(
      `listaCandidatos`
    );

    return {
      ok: false,
      code: 201,
      message: "Usuario criado com sucesso",
      data: result,
    };
  }
}
