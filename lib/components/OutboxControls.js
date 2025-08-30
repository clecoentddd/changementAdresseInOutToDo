"use client";
import { useState, useEffect } from 'react';
import { OutboxStore } from '../stores/OutboxStore';
import { OutboxProcessor } from '../slices/01_FrontOffice_CréerUnCompte/OutboxProcessor';

export default function OutboxControls() {
  const [outboxItems, setOutboxItems] = useState([]);

  const fetchOutboxItems = async () => {
    const items = await OutboxStore.all();
    // Sort items by timestamp, most recent first
    const sortedItems = items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setOutboxItems(sortedItems);
  };

  useEffect(() => {
    fetchOutboxItems();
    const interval = setInterval(fetchOutboxItems, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessOutbox = async () => {
    await OutboxProcessor.process();
    await fetchOutboxItems();
  };

  const nonAcknowledgedCount = outboxItems.filter(item => !item.ack).length;

  return (
    <div className="infracard">
      <h2>Step 1: Outbox Controls: send messages</h2>
      <button onClick={handleProcessOutbox} className="button">
        Process Outbox Manually
      </button>
      <h3>Outbox Items ({outboxItems.length})</h3>
      {nonAcknowledgedCount > 0 && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⏱️ Non-acknowledged: {nonAcknowledgedCount}
        </p>
      )}
      <ul>
        {outboxItems.map(item => (
          <li key={item.eventId} className="outbox-item">
            <p>
              <strong>Timestamp:</strong> {item.timestamp}
            </p>
            <p>
              <strong>Tracking ID:</strong> {item.trackingId}{' '}
              {item.ack ? (
                <span title="Acknowledged" style={{ marginLeft: '5px', color: 'green', fontSize: '1.2em' }}>✅</span>
              ) : (
                <span title="Not Acknowledged" style={{ marginLeft: '5px', color: 'red', fontSize: '1.2em' }}>⏱️</span>
              )}
            </p>
            <p><strong>Type:</strong> {item.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}