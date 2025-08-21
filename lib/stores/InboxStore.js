import { db } from '../db';

export class InboxStore {
  static async append(record) {
    await db.inbox.put(record);
    console.log('[InboxStore] Event added to inbox:', record);
  }

  static async acknowledge(record) {
    console.log('[InboxStore] Acknowledging inbox event:', record.event.eventId);
    await db.inbox.update(record.event.eventId, { acknowledged: true });
    const updatedRecord = await db.inbox.get(record.event.eventId);
    console.log('[InboxStore] Inbox event acknowledged:', updatedRecord);
  }

  static async unacknowledged() {
    const allRecords = await db.inbox.toArray();
    const unacknowledgedRecords = allRecords.filter(record => !record.acknowledged);
    console.log('[InboxStore] Fetched unacknowledged inbox records:', unacknowledgedRecords.length);
    return unacknowledgedRecords;
  }
}
