"use client";

import { useState, useEffect } from 'react';
import { OutboxStore } from '../stores/OutboxStore';
import { OutboxProcessor } from '../processors/OutboxProcessor';

export default function OutboxControls() {
  const [outboxItems, setOutboxItems] = useState([]);

  const fetchOutboxItems = async () => {
    const items = await OutboxStore.all();
    setOutboxItems(items);
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

  return (
    <div className="infracard">
      <h2>Outbox Controls</h2>
      <button onClick={handleProcessOutbox} className="button">
        Process Outbox Manually
      </button>
      <h3>Outbox Items ({outboxItems.length})</h3>
      <ul>
        {outboxItems.map(item => (
          <li key={item.eventId} className="outbox-item">
            <p><strong>Event ID:</strong> {item.eventId}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Acknowledged:</strong> {item.ack ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
