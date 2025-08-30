"use client";
import { useState, useEffect } from 'react';
import { FrontEventStoreRepository } from '../stores/FrontEventStore';

export default function FrontEventsList() {
  const [frontEvents, setFrontEvents] = useState({}); // State is now an object
  const [openPayloadId, setOpenPayloadId] = useState(null);

  const groupEventsByTrackingId = (events) => {
    return events.reduce((acc, event) => {
      const { trackingId } = event;
      if (!acc[trackingId]) {
        acc[trackingId] = [];
      }
      acc[trackingId].push(event);
      return acc;
    }, {});
  };

  const fetchFrontEvents = async () => {
    const records = await FrontEventStoreRepository.getAllEvents();
    const groupedRecords = groupEventsByTrackingId(records);
    setFrontEvents(groupedRecords);
  };

  useEffect(() => {
    fetchFrontEvents();
    const interval = setInterval(fetchFrontEvents, 2000);
    return () => clearInterval(interval);
  }, []);

  const togglePayload = (id) => {
    setOpenPayloadId(openPayloadId === id ? null : id);
  };

  return (
    <div className="infracard">
      <h2>FrontEnd - Event Sourced DataBase</h2>
      <p>Total unique tracking IDs: {Object.keys(frontEvents).length}</p>
      {Object.keys(frontEvents).length === 0 ? (
        <p>No events found.</p>
      ) : (
        Object.keys(frontEvents).map(trackingId => (
          <div key={trackingId} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h3>Events for Tracking ID: {trackingId}</h3>
            <ul>
              {frontEvents[trackingId].map(record => (
                <li key={record.id} className="inbox-item" style={{ position: 'relative' }}>
                  {/* Arrow Logic */}
                  {record.type === 'FrontOffice_changementAdresseRequis' && (
                    <span style={{ position: 'absolute', left: '-20px', fontSize: '1.5em' }}>➡️</span>
                  )}
                  {record.type === 'FrontOffice_NouvelleAdresseOfficielleReçuEtValidée' && (
                    <span style={{ position: 'absolute', left: '-20px', fontSize: '1.5em' }}>✅</span>
                  )}
                  
                  <p><strong>ID:</strong> {record.id}</p>
                  <p><strong>Type:</strong> {record.type}</p>
                  <p><strong>Timestamp:</strong> {record.timestamp}</p>
                  
                  {/* Expand/Collapse logic */}
                  <button onClick={() => togglePayload(record.id)}>
                    {openPayloadId === record.id ? 'Hide Payload' : 'Show Payload'}
                  </button>
                  {openPayloadId === record.id && (
                    <pre className="inbox-payload">
                      {JSON.stringify(record.payload, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}