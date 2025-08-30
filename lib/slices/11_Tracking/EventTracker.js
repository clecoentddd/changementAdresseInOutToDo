"use client";
import { useState, useEffect } from 'react';
import { EventBus } from '../../infrastructure/EventBus';

export default function EventTracker() {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState(null);
  const [allTrackingIds, setAllTrackingIds] = useState(new Set());

  useEffect(() => {
    const handleEvent = (event) => {
      // --- DETAILED DEBUG LOGGING ---
      console.log('=== NEW EVENT RECEIVED ===');
      console.log('ETS Type:', event.type);
      console.log('ETS Tracking ID:', event.trackingId);
      console.log('ETS Has trackingId?', !!event.trackingId);
      console.log('ETS Is trackingId a string?', typeof event.trackingId === 'string');
      console.log('ETS Is trackingId non-empty?', event.trackingId?.trim().length > 0);
      console.log('ETS Event ID:', event.eventId);
      console.log('ETS Timestamp:', event.timestamp);
      console.log('ETX Full event:', event);
      console.log('==========================');

      // Add the event to the global events list
      setAllEvents(prev => {
        const newEvents = [...prev, event];
        return newEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });

      // Update tracking IDs if valid
      if (event.trackingId && typeof event.trackingId === 'string' && event.trackingId.trim().length > 0) {
        setAllTrackingIds(prev => new Set(prev).add(event.trackingId));
      }
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

  // Filter events by tracking ID if one is selected
  const filteredEvents = selectedTrackingId
    ? [...allEvents].filter(event => event.trackingId === selectedTrackingId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    : [...allEvents].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
          <option value="">-- All Events --</option>
          {[...allTrackingIds].map((trackingId) => (
            <option key={trackingId} value={trackingId}>
              {trackingId}
            </option>
          ))}
        </select>
      </div>

      <div style={{
        maxHeight: '500px',
        overflowY: 'auto',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        background: '#fff'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 150px 120px',
          padding: '10px 15px',
          fontWeight: 'bold',
          background: '#f8f9fa',
          borderBottom: '1px solid #e9ecef',
          alignItems: 'center',
          minWidth: '700px'
        }}>
          <div>Timestamp</div>
          <div>Event Type</div>
          <div>Tracking ID</div>
        </div>

        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div
              key={`${event.eventId}-${event.timestamp}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 150px 120px',
                padding: '10px 15px',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center',
                minWidth: '700px',
                background: index % 2 === 0 ? '#ffffff' : '#fafafa'
              }}
            >
              <div style={{ fontSize: '14px', color: '#555' }}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
              <div style={{ fontSize: '14px', wordBreak: 'break-word' }}>
                {event.type}
              </div>
              <div style={{ fontSize: '14px', color: '#2a7fda', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {event.trackingId}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No events yet
          </div>
        )}
      </div>
    </div>
  );
}
