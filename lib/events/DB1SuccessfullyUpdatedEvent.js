// This function could be in a file like lib/stores/DB1Repository.js or lib/events/DB1Events.js
export const DB1SuccessfullyUpdatedEvent = ({ trackingId, newAddress }) => ({
  type: 'DB1SuccessfullyUpdated',
  trackingId,
  payload: { newAddress, timestamp: new Date().toISOString() },
});