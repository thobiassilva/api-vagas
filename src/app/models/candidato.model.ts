import {
  TipoUsuario,
  Usuario,
} from "./usuario.model";

export class Candidato extends Usuario {
  constructor(
    public nome: string,
    public username: string,
    public password: string
  ) {
    super(
      nome,
      username,
      password,
      TipoUsuario.Candidato
    );
  }
}
