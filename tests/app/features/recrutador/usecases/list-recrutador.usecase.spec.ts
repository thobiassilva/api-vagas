import { listRecrutadorUsecase } from "../../../../../src/app/features/recrutador/usecases/list-recrutador";
import { UsuarioRepository } from "../../../../../src/app/features/usuario/database/usuario.repository";
import {
  TipoUsuario,
  Usuario,
} from "../../../../../src/app/models/usuario.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("list recrutador usecase", () => {
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
    return new listRecrutadorUsecase();
  };

  const recrutador: Usuario = new Usuario(
    "any_name",
    "any_username",
    "any_password",
    TipoUsuario.Recrutador,
    "any_nomeEmpresa"
  );

  test("deveria retornar uma lista do cache", async () => {
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue([]);

    const sut = makeSut();

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty(
      "message",
      "Recrutadores listados com sucesso - cache"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(0);
  });

  test("deveria retornar uma lista do repository", async () => {
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue(null);
    jest
      .spyOn(UsuarioRepository.prototype, "list")
      .mockResolvedValue([
        recrutador,
        recrutador,
      ]);
    const cacheSpyOn = jest.spyOn(
      CacheRepository.prototype,
      "set"
    );

    const sut = makeSut();

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty(
      "message",
      "Recrutadores listados com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(2);
    expect(cacheSpyOn).toHaveBeenCalledWith(
      "listaRecrutadores",
      result.data
    );
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });

  //   test("deveria retornar um erro se a lista tiver mais que 2 elementos", async () => {
  //     jest
  //       .spyOn(CacheRepository.prototype, "get")
  //       .mockResolvedValue(null);
  //     jest
  //       .spyOn(UsuarioRepository.prototype, "list")
  //       .mockResolvedValue([
  //         recrutador,
  //         recrutador,
  //         recrutador,
  //       ]);
  //     const cacheSpyOn = jest.spyOn(
  //       CacheRepository.prototype,
  //       "set"
  //     );

  //     const sut = makeSut();

  //     const promise = sut.execute();

  //     expect(promise).rejects.toThrow(
  //       new Error("Erro teste")
  //     );
  //   });
});
