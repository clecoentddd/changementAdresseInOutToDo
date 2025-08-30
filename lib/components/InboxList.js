"use client";
import { useState, useEffect } from 'react';
import { InboxStore } from '../stores/InboxStore';
import { OutboxStore } from '../stores/OutboxStore';
import {db} from '../db';

export default function InboxList() {
  const [inboxRecords, setInboxRecords] = useState([]);
  const [openPayloadId, setOpenPayloadId] = useState(null); // New state for collapsible payload

  const fetchInboxRecords = async () => {
    const records = await db.inbox.toArray();
    // Sort items by timestamp, most recent first
    const sortedRecords = records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setInboxRecords(sortedRecords);
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

  const togglePayload = (id) => {
    setOpenPayloadId(openPayloadId === id ? null : id);
  };

  // Calculate the number of non-acknowledged items
  const nonAcknowledgedCount = inboxRecords.filter(record => !record.acknowledged).length;

  return (
    <div className="infracard">
      <h2>Inbox</h2>
      <p>Total records: {inboxRecords.length}</p>
      {/* Counter for non-acknowledged items */}
      {nonAcknowledgedCount > 0 && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⏱️ Unprocessed: {nonAcknowledgedCount}
        </p>
      )}
      <ul>
        {inboxRecords.map(record => (
          <li key={record.eventId} className="inbox-item">
            <p>
              <strong>Tracking ID:</strong> {record.event.trackingId}{' '}
              {/* Conditional icons for acknowledged status */}
              {record.acknowledged ? (
                <span title="Acknowledged" style={{ marginLeft: '5px', color: 'green', fontSize: '1.2em' }}>✅</span>
              ) : (
                <span title="Pending" style={{ marginLeft: '5px', color: 'orange', fontSize: '1.2em' }}>⏱️</span>
              )}
            </p>
            <p><strong>Type:</strong> {record.event.type}</p>
            <p><strong>Timestamp:</strong> {record.timestamp}</p>
            
            {/* Button to toggle payload visibility */}
            <button onClick={() => togglePayload(record.eventId)}>
              {openPayloadId === record.eventId ? 'Hide Payload' : 'Show Payload'}
            </button>

            {/* Conditionally render the payload */}
            {openPayloadId === record.eventId && (
              <pre className="inbox-payload">
                {JSON.stringify(record.event.payload, null, 2)}
              </pre>
            )}
            
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