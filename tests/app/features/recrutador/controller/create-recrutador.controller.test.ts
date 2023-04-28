import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { UsuarioRepository } from "../../../../../src/app/features/usuario/database/usuario.repository";
import { Recrutador } from "../../../../../src/app/models/recrutador.model";
import { TipoUsuario } from "../../../../../src/app/models/usuario.model";
import { UsuarioEntity } from "../../../../../src/app/shared/database/entities/usuario.entity";

describe("Create recrutador controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    // como deletar do banco
    // await TypeormConnection.connection.manager.delete(
    //   UsuarioEntity,
    //   {}
    // );
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const app = createApp();

  const checkFieldNotProvided = (
    res: any,
    field: string
  ) => {
    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty(
      "body.message",
      `${field} was not provided!`
    );
  };

  test.skip("Deveria retornar status 400 se o nome não for informado", async () => {
    const res = await request(app)
      .post("/recrutador")
      .send({});
    checkFieldNotProvided(res, "Nome");
  });

  test.skip("Deveria retornar status 400 se o username não for informado", async () => {
    const res = await request(app)
      .post("/recrutador")
      .send({ nome: "any_name" });
    checkFieldNotProvided(res, "Username");
  });

  test.skip("Deveria retornar status 400 se o password não for informado", async () => {
    const res = await request(app)
      .post("/recrutador")
      .send({
        nome: "any_name",
        username: "any_username",
      });
    checkFieldNotProvided(res, "Password");
  });

  test.skip("Deveria retornar status 400 se o nomeEmpresa não for informado", async () => {
    const res = await request(app)
      .post("/recrutador")
      .send({
        nome: "any_name",
        username: "any_username",
        password: "any_password",
      });
    checkFieldNotProvided(res, "Empresa");
  });

  test.skip("Deveria retornar status 400 se o recrutador já existir", async () => {
    const repositorySpyOn = jest
      .spyOn(
        UsuarioRepository.prototype,
        "getByUsername"
      )
      .mockResolvedValue(
        new Recrutador(
          "any_name",
          "any_username",
          "any_password",
          "any_empresa"
        )
      );

    const res = await request(app)
      .post("/recrutador")
      .send({
        nome: "any_name",
        username: "any_username",
        password: "any_password",
        nomeEmpresa: "any_empresa",
      });
    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty(
      "body.message",
      "Username ja existe"
    );
    expect(repositorySpyOn).toHaveBeenCalled();
    expect(repositorySpyOn).toHaveBeenCalledWith(
      "any_username"
    );
    expect(repositorySpyOn).toHaveBeenCalledTimes(
      1
    );
  });

  test.skip("Deveria retornar status 201 se o recrutador for criado", async () => {
    const res = await request(app)
      .post("/recrutador")
      .send({
        nome: "any_name",
        username: "any_testeusername8",
        password: "any_password",
        nomeEmpresa: "any_empresa",
        tipo: TipoUsuario.Recrutador,
      })
      .expect(201);

    const result =
      await TypeormConnection.connection.manager.findOne(
        UsuarioEntity,
        { where: { id: res.body.data._id } }
      );

    expect(result).toHaveProperty(
      "id",
      res.body.data._id
    );
    expect(result?.id).toBe(res.body.data._id);
  });

  // test("Deveria retornar status 500 se gerar exception", async () => {
  //   const mockUsuarioRepository = jest.fn();
  //   jest.mock(
  //     "../../../../../src/app/features/usuario/database/usuario.repository",
  //     () => {
  //       return jest
  //         .fn()
  //         .mockImplementation(() => {
  //           return {
  //             UsuarioRepository:
  //               mockUsuarioRepository,
  //           };
  //         });
  //     }
  //   );
  //   jest
  //     .spyOn(
  //       UsuarioRepository.prototype,
  //       "create"
  //     )
  //     .mockRejectedValue(null);

  //   const res = await request(app)
  //     .post("/recrutador")
  //     .send({
  //       nome: "any_name",
  //       username: "any_testeusername11",
  //       password: "any_password",
  //       nomeEmpresa: "any_empresa",
  //       tipo: TipoUsuario.Recrutador,
  //     })
  //     .expect(500);
  // });
});
