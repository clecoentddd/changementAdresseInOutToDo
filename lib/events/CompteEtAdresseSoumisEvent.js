// lib/events/createAdresseOfficielleRecueEtValidee.js
export function CompteEtAdresseSoumis({ eventId, trackingId, meta = {}, payload = {} }) {
  return {
    eventId: eventId,
    trackingId: trackingId,
    type: 'addressChanged',
    payload: payload,
    meta: meta,
    timestamp: new Date().toISOString(),
  };
}


