// lib/queries/GetUnacknowledgedInboxRecords.js
import { InboxStore } from './InboxStore';

export const queryNouvellesAdressesSoumisesFromInboxRecords = async () => {
  console.log('[GetUnacknowledgedInboxRecords] Fetching unacknowledged records...');
  return await InboxStore.unacknowledged();
};
