import {
  TipoUsuario,
  Usuario,
} from "./usuario.model";

export class Recrutador extends Usuario {
  constructor(
    public nome: string,
    public username: string,
    public password: string,
    nomeEmpresa: string
  ) {
    super(
      nome,
      username,
      password,
      TipoUsuario.Recrutador,
      nomeEmpresa
    );
  }
}
