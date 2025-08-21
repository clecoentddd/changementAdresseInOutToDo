import { db } from '../db';

export class OutboxStore {
  static async append(event) {
    const eventWithAck = { ...event, ack: false };
    await db.outbox.put(eventWithAck);
    console.log('[OutboxStore] Event added to outbox:', eventWithAck);
  }

  static async all() {
    const allEvents = await db.outbox.toArray();
    // console.log('[OutboxStore] Fetched all outbox events:', allEvents.length);
    return allEvents;
  }

  static async acknowledge(event) {
    console.log('[OutboxStore] Acknowledging outbox event:', event.eventId);
    await db.outbox.update(event.eventId, { ack: true });
    const updatedEvent = await db.outbox.get(event.eventId);
    console.log('[OutboxStore] Outbox event acknowledged:', updatedEvent);
  }

  static async getByEventId(eventId) {
    const event = await db.outbox.get(eventId);
    console.log('[OutboxStore] Fetched outbox event by ID:', eventId, event);
    return event;
  }
}
