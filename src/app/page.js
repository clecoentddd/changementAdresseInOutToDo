"use client";
import { useEffect, useRef } from 'react';
import { EventBus } from '../../lib/infrastructure/EventBus';
import CreateAccountForm from '../../lib/slices/01_FrontOffice_CréerUnCompte/CreateAccountForm';
import AccountsList from '../../lib/slices/02_FrontOffice_ListerLesComptes/AccountsList';
import OutboxControls from '../../lib/components/OutboxControls';
import InboxList from '../../lib/components/InboxList';
import InboxControls from '../../lib/components/InboxControls';
import TodoList from '../../lib/slices/05_BackOffice_VoirLesTodo/ToDoList';
import FrontEventList from '../../lib/components/FrontEventList';
import { InboxSubscriber } from '../../lib/processors/InboxSubscriber';
import TodoProcessing from '../../lib/slices/06_BackOffice_MettreAJourAdresseOfficielle/ToDoProcessingForm';
import { FrontEventLoggerReceiver } from '../../lib/slices/07_FrontOffice_InsérerAdresseOfficielle/FrontEndReceivingAdresseOfficielleProcessor';
import EventTracker from '../../lib/slices/11_Tracking/EventTracker';
import styles from './page.module.css';
import ChangeAddressCommandForm from '../../lib/slices/04_BackOffice_ChangerAdresseManuellement/ChangeAddressCommandForm';
import { accountsProjectionSubscriber } from '../../lib/slices/02_FrontOffice_ListerLesComptes/EventHandler';

export default function Home() {
  const subscriberRef = useRef(null);
  const feLoggerRef = useRef(null);

  // Instantiate the subscriber (this subscribes to the event)
  const subscriber = accountsProjectionSubscriber;

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



      {/* FRONT END - PORTAIL NUMERIQUE */}
      <div>
        <h2 className={styles.sectionHeader}>FRONT END - PORTAIL NUMERIQUE</h2>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.cardFirst}`}>
            <CreateAccountForm />
          </div>
          <div className={`${styles.card} ${styles.cardLast}`}>
            <AccountsList />
          </div>
        </div>
      </div>

      {/* FRONT END - SOFTWARE INFRASTRUCTURE */}
      <div>
        <h2 className={styles.sectionHeader}>FRONT END - SOFTWARE INFRASTRUCTURE </h2>
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

      {/* BACK END - ADMINISTRATION */}
      <div>
        <h2 className={styles.sectionHeader}>BACK END - ADMINISTRATION</h2>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.cardFirst}`}>
            <TodoList />
          </div>
          <div className={`${styles.card} ${styles.cardLast}`}>
            <TodoProcessing />
          </div>
        </div>
      </div>
      <div className={`${styles.card} ${styles.cardLast}`}>
            <ChangeAddressCommandForm />
        </div>

      {/* BACK END - SOFTWARE INFRASTRUCTURE */}
      <div>
        <h2 className={styles.sectionHeader}>BACK END - SOFTWARE INFRASTRUCTURE </h2>
        <div className={`${styles.cardContainer} ${styles.backEndInfraContainer}`}>
          <div className={`${styles.cardInfra} ${styles.cardFirst}`}>
            <InboxList />
          </div>
          <div className={`${styles.cardInfra} ${styles.cardLast}`}>
            <InboxControls />
          </div>
        </div>
      </div>

            {/* EVENT TRACKER SECTION */}
      <div>
        <h2 className={styles.sectionHeader}>EVENT TRACKER</h2>
        <div className={styles.eventTrackerContainer}>
          <div className={styles.eventTrackerInner}>
            <EventTracker />
          </div>
        </div>
      </div>
    </div>
  );
}
