// lib/processors/InboxSubscriber.js
import { db } from '../db';
import { OutboxStore } from '../stores/OutboxStore';
import { EventBus } from '../infrastructure/EventBus';

class InboxRecord {
  constructor(event) {
    this.event = event;
    this.acknowledged = false;
    this.eventId = event.eventId;
    this.trackingId = event.trackingId;
  }
}

export class InboxSubscriber {
  constructor() {
    // Subscribe ONLY to 'changementAdresseRequis'
    EventBus.subscribe('domainEvent_changementAdresseRequis', (event) => this.onEvent(event));
    console.log('[InboxSubscriber] Subscribed to changementAdresseRequis');
  }

  async onEvent(event) {
    console.log(`[InboxSubscriber] Handling event: ${event.type} (ID: ${event.eventId})`);
    try {
      const record = new InboxRecord(event);
      const existingRecord = await db.inbox.get(record.eventId);
      if (existingRecord) {
        console.warn(
          `[InboxSubscriber] Event with eventId ${record.eventId} already exists. Acknowledging...`
        );
        await OutboxStore.acknowledge(event);
      } else {
        await db.inbox.put(record);
        console.log("[InboxSubscriber] Event added to inbox:", record);
      }
    } catch (err) {
      if (err.type !== "NotFoundError") {
        console.error("[InboxSubscriber] Error adding event to inbox:", err);
      }
    }
  }
}
