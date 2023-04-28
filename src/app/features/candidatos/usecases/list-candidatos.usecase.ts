import { TipoUsuario } from "../../../models/usuario.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UsuarioRepository } from "../../usuario/database/usuario.repository";

export class ListCandidatoUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const listaCandidatos =
      await cacheRepository.get(
        `listaCandidatos`
      );

    if (listaCandidatos !== null) {
      return {
        ok: true,
        code: 200,
        message:
          "Candidatos listados com sucesso - cache",
        data: listaCandidatos,
      };
    }
    const repository = new UsuarioRepository();
    const result = await repository.list(
      TipoUsuario.Candidato
    );

    await cacheRepository.set(
      `listaCandidatos`,
      result
    );

    return {
      ok: true,
      code: 200,
      message: "Candidatos listados com sucesso",
      data: result,
    };
  }
}
