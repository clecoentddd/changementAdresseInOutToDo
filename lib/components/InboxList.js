"use client";

import { useState, useEffect } from 'react';
import { InboxStore } from '../stores/InboxStore';
import { OutboxStore } from '../stores/OutboxStore';
import {db} from '../db';

export default function InboxList() {
  const [inboxRecords, setInboxRecords] = useState([]);

  const fetchInboxRecords = async () => {
    // Fetch ALL inbox records (not just unacknowledged)
    const records = await db.inbox.toArray();
    setInboxRecords(records);
  };

  useEffect(() => {
    fetchInboxRecords();
    const interval = setInterval(fetchInboxRecords, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (record) => {
    await InboxStore.acknowledge(record);
    const outboxEvent = await OutboxStore.getByEventId(record.eventId);
    if (outboxEvent) {
      await OutboxStore.acknowledge(outboxEvent);
    }
    await fetchInboxRecords();
  };

  return (
    <div className="infracard">
      <h2>Inbox</h2>
      <p>Total records: {inboxRecords.length}</p>
      <ul>
        {inboxRecords.map(record => (
          <li key={record.eventId} className="inbox-item">
            <p><strong>Event ID:</strong> {record.eventId}</p>
            <p><strong>Type:</strong> {record.event.type}</p>
            <p><strong>Acknowledged:</strong> {record.acknowledged ? 'Yes' : 'No'}</p>
            <pre className="inbox-payload">
              {JSON.stringify(record.event.payload, null, 2)}
            </pre>
            {!record.acknowledged && (
              <button onClick={() => handleAcknowledge(record)} className="ack-button">
                Acknowledge
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
