import { Usuario } from "./usuario.model";
import { v4 as createuuid } from "uuid";

export class Vaga {
  private _id: string;

  constructor(
    public descricao: string,
    public empresa: string,
    public dtLimite: Date,
    public indAtivo: boolean,
    public recrutador: Usuario,
    public maxCandidatos?: number
  ) {
    this._id = createuuid();
  }
}
