import { v4 as createuuid } from "uuid";
import { Candidato } from "./candidato.model";
import { Vaga } from "./vaga.model";

export class Candidatura {
  private _id: string;

  constructor(
    public dtCadastro: Date,
    public indSucesso: boolean,
    public candidato: Candidato,
    public vaga: Vaga
  ) {
    this._id = createuuid();
  }

  public get id() {
    return this._id;
  }

  public static create(
    id: string,
    dtCadastro: Date,
    indAtivo: boolean,
    candidato: Candidato,
    vaga: Vaga
  ) {
    const candidatura = new Candidatura(
      dtCadastro,
      indAtivo,
      candidato,
      vaga
    );
    candidatura._id = id;
    return candidatura;
  }
}
