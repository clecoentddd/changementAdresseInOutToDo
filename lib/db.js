import Dexie from 'dexie';

export const db = new Dexie('PrototypeDB');
db.version(22).stores({
  frontEvents: '++id, eventId,trackingId, type, timestamp',
  outbox: 'eventId, trackingId, type, timestamp',
  inbox: 'eventId, trackingId, type, timestamp, acknowledged',
  accounts: 'accountId, name, address,createdAt, updatedAt',
  backEvents: '++id, trackingId, frontEndRequestId, isDone', 
  toDoChangeAddress: 'trackingId, isDone, retries, isAddressPublished, isDB1Updated', 
});

db.open().then(() => {
  console.log('Database opened successfully');
}).catch(err => {
  console.error('Failed to open db:', err);
});
