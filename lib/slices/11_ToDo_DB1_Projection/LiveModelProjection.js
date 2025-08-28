// db/EventStore.js
import { db } from '../../db';

export async function reconstructDB1TodoList() {
  const nouvelleAdresseEvents = await db.frontEvents
    .where('type')
    .equals('BackOffice_NouvelleAdresseOfficiellePubliée')
    .toArray();

  const db1UpdatedEvents = await db.frontEvents
    .where('type')
    .equals('BackOffice_DB1_Updated')
    .toArray();

  return nouvelleAdresseEvents.filter((event) => {
    return !db1UpdatedEvents.some(
      (updatedEvent) => updatedEvent.trackingId === event.trackingId
    );
  });
}
