// lib/stores/DB1Repository.js
import { EventBus } from '../infrastructure/EventBus';

// New event type for the DB1 update
export const DB1SuccessfullyUpdatedEvent = ({ trackingId, newAddress }) => ({
  type: 'DB1SuccessfullyUpdated',
  trackingId,
  payload: { newAddress, timestamp: new Date().toISOString() },
});

export class DB1Repository {
  static async updateAddress(trackingId, newAddress) {
    console.log(`[DB1Repository] Simulating update for ${trackingId}...`);
    
    // Simulate a database write delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // After the 'DB1' update, publish a new event
    const event = DB1SuccessfullyUpdatedEvent({ trackingId, newAddress });
    await EventBus.publish(event);
    
    console.log(`[DB1Repository] Update complete and event published for ${trackingId}.`);
    return { ok: true };
  }
}