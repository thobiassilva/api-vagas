import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { CandidaturaRepository } from "../database/candidatura.database";

export class ListarCandidaturasUsecase {
  public async execute(
    idCandidato: string
  ): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cachedResult =
      await cacheRepository.get(
        `listaCandidaturas:${idCandidato}`
      );

    if (cachedResult !== null) {
      return {
        ok: true,
        code: 200,
        message:
          "Candidaturas obtidas com sucesso - cache",
        data: cachedResult,
      };
    }

    const repository =
      new CandidaturaRepository();
    const listaCandidaturas =
      await repository.getById(idCandidato);

    await cacheRepository.set(
      `listaCandidaturas:${idCandidato}`,
      listaCandidaturas
    );

    if (!listaCandidaturas) {
      return {
        ok: false,
        code: 404,
        message: "Candidaturas não encontradas",
      };
    }

    return {
      ok: true,
      code: 200,
      message:
        "Candidaturas obtidas com sucesso!",
      data: listaCandidaturas,
    };
  }
}
