import Dexie from 'dexie';

export const db = new Dexie('PrototypeDB');
db.version(11).stores({
  frontEvents: '++id, eventId,trackingId, type, timestamp',
  backEvents: 'eventId, trackingId, type, timestamp',
  outbox: 'eventId, trackingId, type, timestamp',
  inbox: 'eventId, trackingId, type, timestamp, acknowledged',
  accounts: 'accountId, name, address',
  todos: 'id, trackingId, frontEndRequestId, isDone', 
});

db.open().then(() => {
  console.log('Database opened successfully');
}).catch(err => {
  console.error('Failed to open db:', err);
});
