import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { VagaRepository } from "../database/vaga.repository";

export class ListVagasUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const listaVagas = await cacheRepository.get(
      `listaVagas`
    );

    if (listaVagas !== null) {
      return {
        ok: true,
        code: 200,
        message: `Lista de vagas obtidas com sucesso`,
        data: listaVagas,
      };
    }
    const repository = new VagaRepository();
    const result = await repository.list();

    return {
      ok: true,
      code: 200,
      message: "Vagas listadas com sucesso",
      data: result,
    };
  }
}
