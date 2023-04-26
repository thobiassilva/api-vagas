import { CreateRecrutadorUsecase } from "../../../../../src/app/features/recrutador/usecases/create-recrutador.usecase";
import { UsuarioRepository } from "../../../../../src/app/features/usuario/database/usuario.repository";
import {
  TipoUsuario,
  Usuario,
} from "../../../../../src/app/models/usuario.model";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Create recrutador usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new CreateRecrutadorUsecase();
  };

  const recrutador = {
    nome: "any_name",
    username: "any_username",
    password: "any_password",
    nomeEmpresa: "any_nomeEmpresa",
  };

  test("Deveria retornar 400 se o usuário já existir existir", async () => {
    jest
      .spyOn(
        UsuarioRepository.prototype,
        "getByUsername"
      )
      .mockResolvedValue(
        new Usuario(
          recrutador.nome,
          recrutador.username,
          recrutador.password,
          TipoUsuario.Recrutador,
          recrutador.nomeEmpresa
        )
      );

    const sut = makeSut();

    const result = await sut.execute(recrutador);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty(
      "message",
      "Usuario já existe"
    );
  });

  test("deveria retornar sucesso (200) se o recrutador for criado com sucesso ", async () => {
    jest
      .spyOn(
        UsuarioRepository.prototype,
        "getByUsername"
      )
      .mockResolvedValue(null);
    jest
      .spyOn(
        UsuarioRepository.prototype,
        "create"
      )
      .mockResolvedValue(
        new Usuario(
          recrutador.nome,
          recrutador.username,
          recrutador.password,
          TipoUsuario.Recrutador,
          recrutador.nomeEmpresa
        )
      );

    const sut = makeSut();

    const result = await sut.execute(recrutador);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty(
      "message",
      "Usuario criado com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data.id).toBeDefined();
    expect(result.data.id).toHaveLength(36);
  });
});
