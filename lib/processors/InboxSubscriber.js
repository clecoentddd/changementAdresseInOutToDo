import { db } from '../db';
import { OutboxStore } from '../stores/OutboxStore';

class InboxRecord {
  constructor(event) {
    this.event = event;
    this.acknowledged = false;
    this.eventId = event.eventId;
    this.trackingId = event.trackingId;
  }
}

export class InboxSubscriber {
  constructor(bus, eventTypes) {
    eventTypes.forEach(type => {
      bus.subscribe(type, (event) => this.onEvent(event));
      console.log('[InboxSubscriber] Subscribed to event type:', type);
    });
  }

  async onEvent(event) {
    try {
      const record = new InboxRecord(event);
      const existingRecord = await db.inbox.get(record.eventId);

      if (existingRecord) {
        // Record already exists, just acknowledge it
        console.warn(`[InboxSubscriber] Event with eventId ${record.eventId} already exists. Acknowledging...`);
        await OutboxStore.acknowledge(event);
        console.log(`[InboxSubscriber] Event with eventId ${record.eventId}  Acknowledging in OutBox !`);
    
      } else {
        // Insert new record
        await db.inbox.put(record);
        console.log('[InboxSubscriber] Event added to inbox:', record);
      }
    } catch (err) {
      // Only log errors that are not "not found" errors
      if (err.type !== 'NotFoundError') {
        console.error('[InboxSubscriber] Error adding event to inbox:', err);
      }
    }
  }
}

// Assuming InboxStore is in scope or imported
class InboxStore {
  static async acknowledge(record) {
    console.log('[InboxStore] Acknowledging inbox event:', record.event.eventId);
    await db.inbox.update(record.event.eventId, { acknowledged: true });
    const updatedRecord = await db.inbox.get(record.event.eventId);
    console.log('[InboxStore] Inbox event acknowledged:', updatedRecord);
  }
}
