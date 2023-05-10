import request from 'supertest';
import { UsuarioRepository } from '../../../../../src/app/features/usuario/database/usuario.repository';
import { Recrutador } from '../../../../../src/app/models/recrutador.model';
import {
  TipoUsuario,
  Usuario,
} from '../../../../../src/app/models/usuario.model';
import { UsuarioEntity } from '../../../../../src/app/shared/database/entities/usuario.entity';
import { JwtAdapter } from '../../../../../src/app/shared/util/jwt.adapter';
import { createApp } from '../../../../../src/main/config/express.config';
import { RedisConnection } from '../../../../../src/main/database/redis.connection';
import { TypeormConnection } from '../../../../../src/main/database/typeorm.connection';
import { checkLoginRecrutadorValidator } from '../../../../../src/app/shared/validators/check-login-recrutador';
import { log } from 'console';
import { addDays } from 'date-fns';
import { CreateVagaUsecase } from '../../../../../src/app/features/vaga/usecase/create-vaga.usecase';

const makeAuthorization = async (tipo: TipoUsuario) => {
  const db = TypeormConnection.connection.manager;
  const recrutador = new Usuario(
    'any_name',
    'any_username',
    'any_password',
    tipo,
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

const makeBody = (date?: string) => {
  return {
    descricao: 'any_descricao',
    nomeEmpresa: 'any_empresa',
    dtLimite: date ?? new Date('2032-05-09'),
  };
};

describe('Vaga controller tests', () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterEach(async () => {
    await TypeormConnection.connection.manager.delete(UsuarioEntity, {});
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const app = createApp();

  test('Deveria retornar 401 se o usuario authenticado nao for informado', async () => {
    const res = await request(app)
      .post('/vaga')

      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 401);
  });

  test('Deveria retornar 403 se o usuario authenticado nao for um recrutador', async () => {
    const authorization = await makeAuthorization(TipoUsuario.Candidato);

    const res = await request(app)
      .post('/vaga')
      .set('authorization', authorization.token)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 403);
  });

  test('Deveria retornar 400 se a data limite for inferior a hoje', async () => {
    const authorization = await makeAuthorization(TipoUsuario.Recrutador);

    const data = makeBody('2022-01-01');

    const res = await request(app)
      .post('/vaga')
      .set('authorization', authorization.token)
      .send(data);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty(
      'message',
      'A data deve ser superior a data atual'
    );
  });

  test('Deveria retornar 404 se nao encontrar o recrutador', async () => {
    const authorization = await makeAuthorization(TipoUsuario.Recrutador);

    jest.spyOn(UsuarioRepository.prototype, 'get').mockResolvedValue(null);

    const data = makeBody();

    const res = await request(app)
      .post('/vaga')
      .set('authorization', authorization.token)
      .send(data);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty(
      'message',
      'O recrutador não foi encontrado'
    );
  });

  test('Deveria retornar um 500 se estourar um erro no Usecase', async () => {
    jest
      .spyOn(CreateVagaUsecase.prototype, 'execute')
      .mockImplementation((_) => {
        throw new Error('Mock error');
      });

    const authorization = await makeAuthorization(TipoUsuario.Recrutador);

    const data = makeBody();

    const res = await request(app)
      .post('/vaga')
      .set('authorization', authorization.token)
      .send(data);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 500);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message', 'Error: Mock error');
  });

  test('Deveria retornar 201 ao criar uma vaga', async () => {
    const authorization = await makeAuthorization(TipoUsuario.Recrutador);

    const data = makeBody();

    const res = await request(app)
      .post('/vaga')
      .set('authorization', authorization.token)
      .send(data);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 201);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message', 'A vaga foi criada com sucesso');
  });
});
