import { Return } from "../../../shared/util/return.contract";
import { CandidaturaRepository } from "../database/candidatura.database";

// interface ListarCandidaturasParams {
//   idCandidato: string;
// }

export class ListarCandidaturasUsecase {
  public async execute(
    idCandidato: string
  ): Promise<Return> {
    const repository =
      new CandidaturaRepository();
    const listaCandidaturas =
      await repository.getById(idCandidato);

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
