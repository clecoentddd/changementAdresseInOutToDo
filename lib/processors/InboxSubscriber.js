// lib/processors/InboxSubscriber.js
import { db } from '../db';
import { OutboxStore } from '../stores/OutboxStore';
import { EventBus } from '../infrastructure/EventBus';

class InboxRecord {
  constructor(event) {
    this.event = event;
    this.acknowledged = false;
    this.eventId = event.eventId;
  }
}

export class InboxSubscriber {
  constructor() {
    // Subscribe ONLY to 'FrontOffice_changementAdresseRequis'
    EventBus.subscribe('FrontOffice_domainEvent__changementAdresseSoumise', (event) => this.onEvent(event));
    console.log('[InboxSubscriber] Subscribed to FrontOffice_changementAdresseRequis');
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
        // Create and publish a new BackOffice event
        const backOfficeEvent = {
          eventId: event.eventId, // Create a unique eventId
          trackingId: event.trackingId, // Use the same trackingId for correlation
          type: `BackOffice_${event.type}`, // Set the type to "BackOffice"
          timestamp: new Date().toISOString(), // New timestamp
        };

        // Publish the new BackOffice event
        EventBus.publish(backOfficeEvent);
      }
    } catch (err) {
      if (err.type !== "NotFoundError") {
        console.error("[InboxSubscriber] Error adding event to inbox:", err);
      }
    }
  }
}
