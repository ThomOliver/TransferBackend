const Transfer = require('../models/transfer');
const mockSettlementAPI = require('../mocks/mockSettlementAPI');

const createTransfer = async (req, res) => {
  const { externalId, amount, expectedOn } = req.body;

  try {
    if (!externalId || !amount) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
    if (!/^(\d+(\.\d{1,2})?)$/.test(amount)) {
      return res.status(400).json({ error: 'O valor deve conter no máximo duas casas decimais.' });
    }
    if (expectedOn && new Date(expectedOn) < new Date()) {
      return res.status(400).json({ error: 'A transferência está vencida.' });
    }

    const settlementResponse = await mockSettlementAPI(externalId, amount);
    if (settlementResponse.status !== 'success') {
      return res.status(400).json({ error: 'Erro na liquidação.' });
    }

    const transfer = await Transfer.create({
      externalId,
      amount,
      expectedOn,
      settlementReference: settlementResponse.reference,
    });

    res.status(201).json({
      message: 'Transferência criada com sucesso.',
      transfer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransferById = async (req, res) => {
  const { id } = req.params;

  try {
    const transfer = await Transfer.findOne({ where: { id } });
    if (!transfer) {
      return res.status(404).json({ error: 'Transferência não encontrada.' });
    }

    res.status(200).json({ transfer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll();
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transferências.' });
  }
};

module.exports = {
  createTransfer,
  getTransferById,
  getAllTransfers,
};
