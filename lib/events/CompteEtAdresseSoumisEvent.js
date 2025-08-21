// lib/events/createAdresseOfficielleRecueEtValidee.js
export function CompteEtAdresseSoumis({ eventId, trackingId, meta = {}, payload = {} }) {
  return {
    eventId: eventId,
    trackingId: trackingId,
    type: 'FrontOffice_changementAdresseRequis',
    payload: payload,
    meta: meta,
    timestamp: new Date().toISOString(),
  };
}


