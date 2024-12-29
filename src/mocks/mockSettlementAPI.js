const mockSettlementAPI = async (externalId, amount) => {
  console.log(`Mock API chamada com externalId: ${externalId}, amount: ${amount}`);
  
  if (externalId.startsWith("error")) {
    return { status: 'failure', reference: null };
  }

  return { status: 'success', reference: `ref-${externalId}` };
};

module.exports = mockSettlementAPI;
