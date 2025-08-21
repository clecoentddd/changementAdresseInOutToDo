// lib/events/createNouvelleAdresseEvent.js
export function NouvelleAdressePublieeEvent({ eventId, trackingId, accountId, newAddress, toDoId }) {
  return {
    type: 'NouvelleAdresseOfficiellePubliée',
    payload: {
      eventId,
      trackingId,
      accountId,
      newAddress,
      toDoId,
    },
    timestamp: new Date().toISOString(), // Optional
  };
}
