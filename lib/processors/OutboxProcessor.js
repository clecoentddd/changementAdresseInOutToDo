import { db } from '../db';
import { EventBus } from '../infrastructure/EventBus';

export class OutboxProcessor {
  static async process() {
    console.log('[OutboxProcessor] Processing outbox...');
    const allEvents = await db.outbox.toArray();
    const unacknowledgedEvents = allEvents.filter(event => !event.ack);

    console.log(`[OutboxProcessor] Found ${unacknowledgedEvents.length} unacknowledged outbox events`);

    for (const event of unacknowledgedEvents) {
      console.log('[OutboxProcessor] Publishing outbox event:', event.eventId);

      // Modify the event type to indicate it's a domain event
      const domainEvent = {
        ...event,
        type: 'domainEvent_changementAdresseRequis', // Prepend "domain:" to the original type
      };

      await EventBus.publish(domainEvent);

    }
  }
}
