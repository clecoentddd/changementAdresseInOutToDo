export class EventBus {
  static subscribers = {};

  static subscribe(eventType, callback) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(callback);
    console.log(`Subscribed to ${eventType}, total subscribers:`, this.subscribers[eventType].length);
    return callback; // Return the callback for unsubscribing
  }

  static unsubscribe(eventType, callback) {
    if (!this.subscribers[eventType]) return;

    this.subscribers[eventType] = this.subscribers[eventType].filter(
      cb => cb !== callback
    );
    console.log(`Unsubscribed from ${eventType}, remaining subscribers:`, this.subscribers[eventType].length);
  }

  static async publish(event) {
    // console.log('Publishing event:', event);
    const callbacks = this.subscribers[event.type];
    if (callbacks) {
      console.log(`Found ${callbacks.length} subscribers for ${event.type}`);
      for (const callback of callbacks) {
        await callback(event);
      }
    } else {
      console.warn(`No subscribers for event type: ${event.type}`);
    }
  }
}
