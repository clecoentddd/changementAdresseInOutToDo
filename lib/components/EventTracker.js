"use client";
import { useState, useEffect } from 'react';
import { EventBus } from '../infrastructure/EventBus';

export default function EventTracker() {
  const [events, setEvents] = useState({});
  const [selectedTrackingId, setSelectedTrackingId] = useState(null);
  const [allTrackingIds, setAllTrackingIds] = useState([]);

  useEffect(() => {
    const handleEvent = (event) => {
      // --- DETAILED DEBUG LOGGING ---
      console.log('=== NEW EVENT RECEIVED ===');
      console.log('Type:', event.type);
      console.log('Tracking ID:', event.trackingId);
      console.log('Has trackingId?', !!event.trackingId);
      console.log('Is trackingId a string?', typeof event.trackingId === 'string');
      console.log('Is trackingId non-empty?', event.trackingId?.trim().length > 0);
      console.log('Event ID:', event.eventId);
      console.log('Timestamp:', event.timestamp);
      console.log('Payload:', event.payload);
      console.log('Full event:', event);
      console.log('==========================');

      // --- VALIDATE EVENT FORMAT ---
      if (!event.trackingId || typeof event.trackingId !== 'string' || event.trackingId.trim().length === 0) {
        console.error('❌ INVALID EVENT: Missing or invalid trackingId!', event);
        return; // Skip invalid events
      }

      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };

        if (!updatedEvents[event.trackingId]) {
          updatedEvents[event.trackingId] = [];
          setAllTrackingIds((prev) => [...new Set([...prev, event.trackingId])]);
        }

        // Avoid duplicates by checking timestamp
        if (!updatedEvents[event.trackingId].some(e => e.timestamp === event.timestamp)) {
          updatedEvents[event.trackingId].push(event);
          updatedEvents[event.trackingId].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        }

        return updatedEvents;
      });
    };

    EventBus.subscribe('*', handleEvent);
    console.log('[EventTracker] Subscribed to all events (*)');

    return () => {
      EventBus.unsubscribe('*', handleEvent);
      console.log('[EventTracker] Unsubscribed from all events');
    };
  }, []);

  const selectTrackingId = (trackingId) => {
    setSelectedTrackingId(trackingId);
    console.log('[EventTracker] Selected tracking ID:', trackingId);
  };

  return (
    <div style={{ padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Event Tracker (Real-Time)</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Filter by Tracking ID:</label>
        <select
          onChange={(e) => selectTrackingId(e.target.value)}
          value={selectedTrackingId || ''}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">-- Select a Tracking ID --</option>
          {allTrackingIds.map((trackingId) => (
            <option key={trackingId} value={trackingId}>
              {trackingId}
            </option>
          ))}
        </select>
      </div>

      {selectedTrackingId && (
        <div>
          <h3>Events for Tracking ID: {selectedTrackingId}</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
            {events[selectedTrackingId]?.length > 0 ? (
              events[selectedTrackingId].map((event, index) => (
                <div
                  key={event.timestamp || index}
                  style={{
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '10px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Type:</strong> {event.type}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Tracking ID:</strong> {event.trackingId}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}
                  </div>
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <p>No events yet for this tracking ID.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
