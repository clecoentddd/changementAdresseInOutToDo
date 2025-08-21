"use client";
import { useEffect, useRef } from 'react';
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
import EventTracker from '../../lib/components/EventTracker';
import styles from './page.module.css';

export default function Home() {
  const subscriberRef = useRef(null);
  const feLoggerRef = useRef(null);

  useEffect(() => {
    if (!subscriberRef.current) {
      subscriberRef.current = new InboxSubscriber();
      console.log('[Home] InboxSubscriber registered for FrontOffice_changementAdresseRequis');
    } else {
      console.warn('[Home] InboxSubscriber ALREADY EXISTS. Skipping.');
    }

    if (!feLoggerRef.current) {
      feLoggerRef.current = new FrontEventLoggerReceiver();
      console.log('[Home] FrontEventLogger subscribed to BackOffice_NouvelleAdresseOfficiellePubliée');
    }

    return () => {
      // subscriberRef.current?.unsubscribe();
      // feLoggerRef.current?.unsubscribe();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Changement Adresse - Outbox - Inbox - ToDo List</h1>

      {/* EVENT TRACKER SECTION */}
      <div>
        <h2 className={styles.sectionHeader}>EVENT TRACKER</h2>
        <div className={styles.eventTrackerContainer}>
          <div className={styles.eventTrackerInner}>
            <EventTracker />
          </div>
        </div>
      </div>

      {/* FRONT END - BUSINESS */}
      <div>
        <h2 className={styles.sectionHeader}>FRONT END - BUSINESS</h2>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.cardFirst}`}>
            <CreateAccountForm />
          </div>
          <div className={`${styles.card} ${styles.cardLast}`}>
            <AccountsList />
          </div>
        </div>
      </div>

      {/* FRONT END - INFRA */}
      <div>
        <h2 className={styles.sectionHeader}>FRONT END - INFRA</h2>
        <div className={`${styles.cardContainer} ${styles.frontEndInfraContainer}`}>
          <div className={`${styles.cardInfra} ${styles.cardFirst}`}>
            <FrontEventList />
          </div>
          <div className={`${styles.cardInfra} ${styles.cardLast}`}>
            <OutboxControls />
          </div>
        </div>
      </div>

      {/* Separator before BACK END - BUSINESS */}
      <div className={styles.separator}></div>

      {/* BACK END - BUSINESS */}
      <div>
        <h2 className={styles.sectionHeader}>BACK END - BUSINESS</h2>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.cardFirst}`}>
            <TodoList />
          </div>
          <div className={`${styles.card} ${styles.cardLast}`}>
            <TodoProcessing />
          </div>
        </div>
      </div>

      {/* BACK END - INFRA */}
      <div>
        <h2 className={styles.sectionHeader}>BACK END - INFRA</h2>
        <div className={`${styles.cardContainer} ${styles.backEndInfraContainer}`}>
          <div className={`${styles.cardInfra} ${styles.cardFirst}`}>
            <InboxList />
          </div>
          <div className={`${styles.cardInfra} ${styles.cardLast}`}>
            <InboxControls />
          </div>
        </div>
      </div>
    </div>
  );
}
