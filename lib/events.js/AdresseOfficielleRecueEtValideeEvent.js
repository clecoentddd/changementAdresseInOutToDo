// lib/events/createAdresseOfficielleRecueEtValidee.js
export function AdresseOfficielleRecueEtValidee({ eventId, trackingId, accountId, toDoId, address }) {
  return {
    eventId, 
    trackingId, 
    payload: {
      accountId,
      toDoId,
      address, 
    },
    type: 'NouvelleAdresseOfficielleReçuEtValidée',
    timestamp: new Date().toISOString(),
  };
}
