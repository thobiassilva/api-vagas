import { TipoUsuario } from "../../../models/usuario.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UsuarioRepository } from "../../usuario/database/usuario.repository";

export class listRecrutadorUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const listaRecrutadores =
      await cacheRepository.get(
        `listaRecrutadores`
      );

    if (listaRecrutadores) {
      return {
        ok: true,
        code: 200,
        message:
          "Recrutadores listados com sucesso - cache",
        data: listaRecrutadores,
      };
    }
    const repository = new UsuarioRepository();
    const result = await repository.list(
      TipoUsuario.Recrutador
    );

    await cacheRepository.set(
      `listaRecrutadores`,
      result
    );

    return {
      ok: true,
      code: 200,
      message:
        "Recrutadores listados com sucesso",
      data: result,
    };
  }
}
