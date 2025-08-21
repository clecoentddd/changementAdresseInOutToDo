import { db } from '../../db';
import { EventBus } from '../../infrastructure/EventBus';

export class OutboxProcessor {
  static async process() {
    console.log('[OutboxProcessor] Processing outbox...');
    const allEvents = await db.outbox.toArray();
    const unacknowledgedEvents = allEvents.filter(event => !event.ack);

    console.log(`[OutboxProcessor] Found ${unacknowledgedEvents.length} unacknowledged outbox events`);

    for (const event of unacknowledgedEvents) {
      console.log('[OutboxProcessor] Publishing outbox event:', event);

      // Modify the event type to indicate it's a domain event
      const domainEvent = {
        ...event,
        type: 'FrontOffice_domainEvent__changementAdresseRequis',
        timestamp: new Date().toISOString() // Add this line to set a new timestamp
      };

      await EventBus.publish(domainEvent);

    }
  }
}
