import { IdGenerator } from '../utils/IdGenerator';

export const AddressChangeRequestedEvent = ({ trackingId, payload }) => ({
  trackingId: trackingId,
  type: 'ChangementAdresseDemandeeEvent',
  timestamp: new Date().toISOString(),
  payload: {
    accountId: payload.accountId,
    address: payload.address,
  },
  eventId: IdGenerator.generate(),
});