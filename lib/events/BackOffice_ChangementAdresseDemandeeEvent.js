export function ChangementAdresseDemandeeEvent({ trackingId, requestId, accountId, address }) {
  return {
    type: 'ChangementAdresseDemandeeEvent',
    trackingId,
    requestId,
    payload: {
      accountId,
      address,
      timestamp: new Date().toISOString()
    }
  };
}