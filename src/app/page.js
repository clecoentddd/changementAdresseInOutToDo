"use client";

import { useEffect } from 'react';
import { EventBus } from '../../lib/infrastructure/EventBus';
import CreateAccountForm from '../../lib/components/CreateAccountForm';
import AccountsList from '../../lib/components/AccountsList';
import OutboxControls from '../../lib/components/OutboxControls';
import InboxList from '../../lib/components/InboxList';
import InboxControls from '../../lib/components/InboxControls';
import TodoList from '../../lib/components/ToDoList';
import FrontEventList from '../../lib/components/FrontEventList';
import { InboxSubscriber } from '../../lib/processors/InboxSubscriber';
import TodoProcessing from '../../lib/components/ToDoProcessingForm';
import { FrontEventLoggerReceiver } from '../../lib/processors/FrontEndReceivingAdresseOfficielleProcessor';


 

export default function Home() {

   useEffect(() => {
    // Register the subscriber for 'addressChanged' events
    const subscriber = new InboxSubscriber(EventBus, new Set(['addressChanged']));
    console.log('[Home] InboxSubscriber registered for addressChanged');

    // Instantiate FrontEventLogger
    const FELoggerReceiver = new FrontEventLoggerReceiver();
    console.log('[Home] FrontEventLogger subscribed to NouvelleAdresseOfficiellePublié');

  }, []);

return (
  <div className="container">
    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Changement Adresse - Outbox - Inbox - ToDo List</h1>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* FRONT END - BUSINESS */}
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#495057' }}>FRONT END - BUSINESS</h2>
        <div style={{
          display: 'flex',
          gap: '0',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#fff',
            borderRight: '1px solid #e9ecef'
          }}>
            <CreateAccountForm />
          </div>
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#fff'
          }}>
            <AccountsList />
          </div>
        </div>
      </div>

      {/* FRONT END - INFRA */}
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#495057' }}>FRONT END - INFRA</h2>
        <div style={{
          display: 'flex',
          gap: '0',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fff5f5'
        }}>
          <div style={{
            flex: 1,
            padding: '20px',
            borderRight: '1px solid #e9ecef'
          }}>
            <FrontEventList />
          </div>
          <div style={{
            flex: 1,
            padding: '20px'
          }}>
            <OutboxControls />
          </div>
        </div>
      </div>

      {/* BACK END - BUSINESS */}
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#495057' }}>BACK END - BUSINESS</h2>
        <div style={{
          display: 'flex',
          gap: '0',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#fff',
            borderRight: '1px solid #e9ecef'
          }}>
            <TodoList />
          </div>
          <div style={{
            flex: 1,
            padding: '20px'
          }}>
            <TodoProcessing />
          </div>
        </div>
      </div>

      {/* BACK END - INFRA */}
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#495057' }}>BACK END - INFRA</h2>
        <div style={{
          display: 'flex',
          gap: '0',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f5f8ff'
        }}>
          <div style={{
            flex: 1,
            padding: '20px',
            borderRight: '1px solid #e9ecef'
          }}>
            <InboxList />
          </div>
          <div style={{
            flex: 1,
            padding: '20px'
          }}>
            <InboxControls />
          </div>
        </div>
      </div>
    </div>
  </div>
);



}
