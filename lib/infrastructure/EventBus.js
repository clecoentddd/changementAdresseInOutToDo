export class EventBus {
  static subscribers = {};
  static wildcardSubscribers = [];

  static subscribe(eventType, callback) {
    if (eventType === '*') {
      this.wildcardSubscribers.push(callback);
      console.log(`Subscribed to WILDCARD (*), total wildcard subscribers:`, this.wildcardSubscribers.length);
    } else {
      if (!this.subscribers[eventType]) {
        this.subscribers[eventType] = [];
      }
      this.subscribers[eventType].push(callback);
      console.log(`Subscribed to ${eventType}, total subscribers:`, this.subscribers[eventType].length);
    }
    return callback;
  }

  static unsubscribe(eventType, callback) {
    if (eventType === '*') {
      this.wildcardSubscribers = this.wildcardSubscribers.filter(cb => cb !== callback);
      console.log(`Unsubscribed from WILDCARD (*), remaining wildcard subscribers:`, this.wildcardSubscribers.length);
    } else if (this.subscribers[eventType]) {
      this.subscribers[eventType] = this.subscribers[eventType].filter(cb => cb !== callback);
      console.log(`Unsubscribed from ${eventType}, remaining subscribers:`, this.subscribers[eventType].length);
    }
  }

 static async publish(event) {
  // Log the event being published
  console.log(
    '[EventBus] Publishing event:',
    {
      type: event.type,
      eventId: event.eventId,
      trackingId: event.trackingId,
      timestamp: event.timestamp,
    }
  );

  // Call specific subscribers for the event type
  const callbacks = this.subscribers[event.type];
  if (callbacks && callbacks.length > 0) {
    console.log(`[EventBus] Found ${callbacks.length} specific subscribers for ${event.type}`);
    for (const [index, callback] of callbacks.entries()) {
      console.log(`[EventBus] Calling specific subscriber ${index + 1}/${callbacks.length} for ${event.type} (ID: ${event.eventId})`);
      await callback(event);
    }
  } else {
    console.warn(`[EventBus] No specific subscribers for event type: ${event.type}`);
  }

  // Call wildcard subscribers
  if (this.wildcardSubscribers.length > 0) {
    console.log(`[EventBus] Found ${this.wildcardSubscribers.length} wildcard subscribers`);
    for (const [index, callback] of this.wildcardSubscribers.entries()) {
      console.log(`[EventBus] Calling wildcard subscriber ${index + 1}/${this.wildcardSubscribers.length} for ${event.type} (ID: ${event.eventId})`);
      await callback(event);
    }
  } else {
    console.log('[EventBus] No wildcard subscribers');
  }
}


}
