const mockSettlementAPI = require('../mocks/mockSettlementAPI');

test('Deve retornar sucesso para externalId válido', async () => {
  const response = await mockSettlementAPI('validId', 100.00);
  expect(response.status).toBe('success');
  expect(response.reference).toBe('ref-validId');
});

test('Deve retornar falha para externalId inválido', async () => {
  const response = await mockSettlementAPI('error123', 100.00);
  expect(response.status).toBe('failure');
  expect(response.reference).toBeNull();
});
