const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Transfer = require('../models/transfer');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Transfer.destroy({ where: {}, truncate: true, restartIdentity: true });
});

describe('Rotas de Transferência - Casos Adicionais', () => {
  test('Deve retornar erro ao criar transferência com amount inválido (mais de 2 casas decimais)', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .send({
        externalId: 'abc123',
        amount: 100.555,
        expectedOn: '2024-12-31',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'O valor deve conter no máximo duas casas decimais.');
  });

  test('Deve retornar erro ao criar transferência com expectedOn no passado', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .send({
        externalId: 'abc123',
        amount: 100.5,
        expectedOn: '2023-12-01',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'A transferência está vencida.');
  });

  test('Deve retornar erro ao buscar transferência com ID inexistente', async () => {
    const res = await request(app).get('/api/transfers/999'); 
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Transferência não encontrada.');
  });

  test('Deve retornar uma transferência específica por ID', async () => {
    const transfer = await Transfer.create({
      externalId: 'xyz789',
      amount: 200.75,
      expectedOn: '2025-01-01',
    });

    const res = await request(app).get(`/api/transfers/${transfer.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.transfer).toHaveProperty('id', transfer.id);
    expect(res.body.transfer).toHaveProperty('externalId', 'xyz789');
    expect(res.body.transfer).toHaveProperty('amount', '200.75'); 
  });

  test('Deve retornar erro ao criar transferência sem expectedOn (permitido)', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .send({
        externalId: 'abc123',
        amount: 150.0,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('transfer');
    expect(res.body.transfer).toHaveProperty('externalId', 'abc123');
    expect(res.body.transfer.expectedOn).toBeNull(); 
  });
});
