import { Return } from "../../../shared/util/return.contract";
import { CandidaturaRepository } from "../database/candidatura.database";

// interface ListarCandidaturasParams {
//   idCandidato: string;
// }

export class ListarCandidaturasUsecase {
  public async execute(
    idCandidato: string
  ): Promise<Return> {
    console.log("entrou usecase");
    const repository =
      new CandidaturaRepository();
    const listaCandidaturas =
      await repository.getById(idCandidato);
    console.log("voltou usecase");
    console.log(listaCandidaturas);

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
