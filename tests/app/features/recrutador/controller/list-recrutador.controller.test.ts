import { createApp } from '../../../../../src/main/config/express.config';
import request from 'supertest';
import { UsuarioEntity } from '../../../../../src/app/shared/database/entities/usuario.entity';
import { RedisConnection } from '../../../../../src/main/database/redis.connection';
import { TypeormConnection } from '../../../../../src/main/database/typeorm.connection';
import { Recrutador } from '../../../../../src/app/models/recrutador.model';
import { JwtAdapter } from '../../../../../src/app/shared/util/jwt.adapter';
import { Usuario } from '../../../../../src/app/models/usuario.model';
import { UsuarioRepository } from '../../../../../src/app/features/usuario/database/usuario.repository';
import { listRecrutadorUsecase } from '../../../../../src/app/features/recrutador/usecases/list-recrutador';
import { CacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository';

// jest.mock('ioredis', () => require('ioredis-mock'));

const makeAuthorization = async () => {
  const db = TypeormConnection.connection.manager;
  const recrutador = new Recrutador(
    'any_name',
    'any_username',
    'any_password',
    'any_nome_empresa'
  );

  const userEntity = db.create(UsuarioEntity, {
    id: recrutador.id,
    nome: recrutador.nome,
    username: recrutador.username,
    password: recrutador.password,
    nomeEmpresa: recrutador.nomeEmpresa,
    tipo: recrutador.tipo,
  });

  await db.save(userEntity);

  const token = JwtAdapter.createToken(userEntity);

  const recrutadorEntity = await db.findOne(UsuarioEntity, {
    where: {
      id: userEntity.id,
    },
  });

  const user = UsuarioRepository.mapEntityToModel(
    recrutadorEntity as UsuarioEntity
  );

  return { token, user };
};

const saveListRecrutadoresCache = async (userList: Usuario[]) => {
  await RedisConnection.connection.set(
    'listaRecrutadores',
    JSON.stringify(userList)
  );
};

const makeUser = async (username: string) => {
  const db = TypeormConnection.connection.manager;
  const recrutador = new Recrutador(
    'any_name',
    username,
    'any_password',
    'any_nome_empresa'
  );

  const userEntity = db.create(UsuarioEntity, {
    id: recrutador.id,
    nome: recrutador.nome,
    username: recrutador.username,
    password: recrutador.password,
    nomeEmpresa: recrutador.nomeEmpresa,
    tipo: recrutador.tipo,
  });

  await db.save(userEntity);

  const recrutadorEntity = await db.findOne(UsuarioEntity, {
    where: {
      id: userEntity.id,
    },
  });

  const user = UsuarioRepository.mapEntityToModel(
    recrutadorEntity as UsuarioEntity
  );

  return user;
};

const clearEntities = async () => {
  await TypeormConnection.connection.manager.delete(UsuarioEntity, {});
  // await RedisConnection.connection.del('listaRecrutadores');
};

describe('List recrutador controller tests', () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
    jest.spyOn(CacheRepository.prototype, 'get').mockResolvedValue(null);
  });

  afterEach(async () => {
    await clearEntities();
  });

  const app = createApp();

  test('Deveria retornar status 200 e uma lista de recrutadores do banco', async () => {
    const authorization = await makeAuthorization();
    const res = await request(app)
      .get('/recrutador')
      .set('authorization', authorization.token)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty(
      'message',
      'Recrutadores listados com sucesso'
    );
    expect(res.body.data).toEqual([authorization.user]);
  });

  // test('Deveria retornar status 200 e uma lista de recrutadores do cache', async () => {
  //   const authorization = await makeAuthorization();
  //   await saveListRecrutadoresCache([authorization.user, authorization.user]);

  //   const res = await request(app)
  //     .get('/recrutador')
  //     .set('authorization', authorization.token)
  //     .send();

  //   expect(res).toBeDefined();
  //   expect(res).toHaveProperty('statusCode', 200);
  //   expect(res).toHaveProperty('body');
  //   expect(res.body).toHaveProperty('data');
  //   expect(res.body).toHaveProperty(
  //     'message',
  //     'Recrutadores listados com sucesso - cache'
  //   );
  //   expect(res.body.data).toEqual([authorization.user, authorization.user]);
  // });

  test('Deveria retornar status 500 ao retornar mais de 2 recrutadores', async () => {
    await makeUser('any_username_1');
    await makeUser('any_username_2');
    await makeUser('any_username_3');

    const authorization = await makeAuthorization();

    const res = await request(app)
      .get('/recrutador')
      .set('authorization', authorization.token)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 500);
  });

  test('Deveria retornar status 500 ao estourar um erro no Usecase', async () => {
    jest
      .spyOn(listRecrutadorUsecase.prototype, 'execute')
      .mockImplementation(() => {
        throw new Error('Mock error');
      });

    const authorization = await makeAuthorization();

    const res = await request(app)
      .get('/recrutador')
      .set('authorization', authorization.token)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 500);
  });

  test('Deveria retornar status 500 ao estourar um erro no Repositorio', async () => {
    jest.spyOn(UsuarioRepository.prototype, 'list').mockImplementation((_) => {
      throw new Error('Mock error');
    });

    const authorization = await makeAuthorization();

    const res = await request(app)
      .get('/recrutador')
      .set('authorization', authorization.token)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 500);
  });
});
