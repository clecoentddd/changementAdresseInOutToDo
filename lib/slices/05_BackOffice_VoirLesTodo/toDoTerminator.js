// lib/slices/05_BackOffice_VoirLesTodo/ToDoTerminator.js
import { EventBus } from '../../infrastructure/EventBus';
import { toDoChangeAddress } from '../../stores/toDoChangeAddressStore';

export class ToDoTerminator {
  /**
   * Initializes the subscriber to listen for completed events.
   */
  static initialize() {
    EventBus.subscribe('BackOffice_NouvelleAdresseOfficiellePubliée', this.handleEvent);
    console.log('[ToDoTerminator] Subscribed to BackOffice_NouvelleAdresseOfficiellePubliée.');
  }

  /**
   * Handles the incoming event to update the corresponding to-do item.
   * @param {object} event The incoming event from the EventBus.
   */
  static async handleEvent(event) {
    try {
      console.log(`[ToDoTerminator] Received completion event for trackingId: ${event.trackingId}`);
      
      // Update the to-do item using the trackingId
      await toDoChangeAddress.changeAddressComplete(event.trackingId);

      console.log(`[ToDoTerminator] Marked to-do with trackingId ${event.trackingId} as done.`);
    } catch (err) {
      console.error('[ToDoTerminator] Failed to terminate to-do:', err);
    }
  }

  /**
   * Cleans up the subscription.
   */
  static unsubscribe() {
    EventBus.unsubscribe('BackOffice_NouvelleAdresseOfficiellePubliée', this.handleEvent);
    console.log('[ToDoTerminator] Unsubscribed from BackOffice_NouvelleAdresseOfficiellePubliée.');
  }
}