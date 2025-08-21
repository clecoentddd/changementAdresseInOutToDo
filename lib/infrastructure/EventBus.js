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
    // Call specific subscribers for the event type
    const callbacks = this.subscribers[event.type];
    if (callbacks) {
      console.log(`Found ${callbacks.length} subscribers for ${event.type}`);
      for (const callback of callbacks) {
        await callback(event);
      }
    } else {
      console.warn(`No specific subscribers for event type: ${event.type}`);
    }

    // Call wildcard subscribers
    if (this.wildcardSubscribers.length > 0) {
      console.log(`Found ${this.wildcardSubscribers.length} wildcard subscribers`);
      for (const callback of this.wildcardSubscribers) {
        await callback(event);
      }
    } else {
      console.warn('No wildcard subscribers');
    }
  }
}
