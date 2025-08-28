export function BackOfficeDB1DemandeTraitéeEvent({ trackingId, accountId }) {
  return {
    eventId: uuidv4(),
    trackingId: trackingId,
    type: 'BackOffice_DB1_DemandeTraitée',
    payload: { accountId },
    timestamp: new Date().toISOString(),
  };
}