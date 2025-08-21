// lib/events/createNouvelleAdresseEvent.js
export function NouvelleAdressePublieeEvent({ eventId, trackingId, accountId, newAddress, toDoId }) {
  return {
    type: 'BackOffice_NouvelleAdresseOfficiellePubliée',
    eventId,
    trackingId,
    toDoId,
    payload: {
      accountId,
      newAddress,
    },
    timestamp: new Date().toISOString(), // Optional
  };
}
