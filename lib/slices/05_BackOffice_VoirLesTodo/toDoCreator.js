// lib/slices/05_BackOffice_VoirLesTodo/TodoCreator.js
import { IdGenerator } from '../../utils/IdGenerator';
import { EventBus } from '../../infrastructure/EventBus';
import { toDoChangeAddress } from '../../stores/toDoChangeAddressStore';

export class ToDoCreator {
  /**
   * Subscribes to the "ChangementAdresseDemandeeEvent" to create a todo item.
   * This function sets up the event listener.
   */
  static initialize() {
    EventBus.subscribe('ChangementAdresseDemandeeEvent', this.handleEvent);
    console.log('[TodoCreator] Subscribed to ChangementAdresseDemandeeEvent.');
  }

  /**
   * Handles the incoming event, creates a new todo event, and saves it.
   * @param {object} event The incoming event from the EventBus.
   */
  static async handleEvent(event) {
    try {
      console.log('[TodoCreator] Received event to process:', event);

      // Format the todo text
      const todoText = `[${event.type}] New address: ${event.payload.address}`;

      // Create the todo object (which is a new event to be saved)
      const todoEvent = {
        id: IdGenerator.generate(),
        trackingId: event.trackingId,
        isDone: false,
        isAddressPublished: false,
        isDB1Updated: false,
      };

      await toDoChangeAddress.save(todoEvent);

      console.log('[TodoCreator] Todo event saved:', todoEvent);
    } catch (err) {
      console.error('[TodoCreator] Failed to create todo from event:', err);
    }
  }
}
