"use client";
import { useState, useEffect } from 'react';
import { db } from '../db';

export default function FrontEventsList() {
  const [frontEvents, setFrontEvents] = useState([]);

  const fetchFrontEvents = async () => {
    // Fetch ALL frontEvents records
    const records = await db.frontEvents.toArray();
    setFrontEvents(records);
  };

  useEffect(() => {
    fetchFrontEvents();
    const interval = setInterval(fetchFrontEvents, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="infracard">
      <h2>Front Events</h2>
      <p>Total records: {frontEvents.length}</p>
      <ul>
        {frontEvents.map(record => (
          <li key={record.id} className="inbox-item">
            <p><strong>ID:</strong> {record.id}</p>
            <p><strong>Event ID:</strong> {record.eventId}</p>
            <p><strong>Tracking ID:</strong> {record.trackingId}</p>
            <p><strong>Type:</strong> {record.type}</p>
            <p><strong>Timestamp:</strong> {record.timestamp}</p>
            <pre className="inbox-payload">
              {JSON.stringify(record.payload, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
