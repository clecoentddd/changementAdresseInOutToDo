"use client";
import { useState, useEffect } from 'react';
import { FrontEventStoreRepository} from '../stores/FrontEventStore';

export default function FrontEventsList() {
  const [frontEvents, setFrontEvents] = useState([]);

  const fetchFrontEvents = async () => {
    // Fetch ALL frontEvents records
    const records = await FrontEventStoreRepository.getAllEvents();
    setFrontEvents(records);
  };

  useEffect(() => {
    fetchFrontEvents();
    const interval = setInterval(fetchFrontEvents, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="infracard">
      <h2>FrontEnd - Event Sourced DataBase</h2>
      <p>Total records: {frontEvents.length}</p>
      <ul>
        {frontEvents.map(record => (
          <li key={record.id} className="inbox-item">
            <p><strong>ID:</strong> {record.id}</p>
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
