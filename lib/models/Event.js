export class Event {
  constructor(eventId, trackingId, type, meta, payload) {
    this.eventId = eventId;
    this.trackingId = trackingId;
    this.type = type;
    this.meta = meta;
    this.payload = payload;
    this.timestamp = new Date().toISOString();
  }
}