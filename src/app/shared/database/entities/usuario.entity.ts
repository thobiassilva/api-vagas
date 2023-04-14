import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { TipoUsuario } from "../../../models/usuario.model";
import { VagaEntity } from "./vaga.entity";

@Entity("usuario")
export class UsuarioEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nome: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 1,
    enum: ["A", "R", "C"],
  })
  tipo: TipoUsuario;

  @Column({
    nullable: true,
    name: "nome_empresa",
  })
  nomeEmpresa: string;

  @CreateDateColumn({
    name: "dthr_cadastro",
  })
  dthrCadastro: Date;
}
