// lib/slices/05_BackOffice_VoirLesTodo/toDoDB1Terminator.js
import { EventBus } from '../../infrastructure/EventBus';
import { toDoDB1Repository } from '../../stores/toDoDB1Repository';
import { DB1SuccessfullyUpdatedEvent } from '../../events/DB1SuccessfullyUpdatedEvent';

export class ToDoDB1Terminator {
  /**
   * Initializes the subscriber to listen for the DB1 completion event.
   */
  static initialize() {
    EventBus.subscribe(DB1SuccessfullyUpdatedEvent({}).type, this.handleEvent);
    console.log('[ToDoDB1Terminator] Subscribed to DB1SuccessfullyUpdated.');
  }

  /**
   * Handles the incoming event to update the corresponding to-do item.
   * @param {object} event The incoming event from the EventBus.
   */
  static async handleEvent(event) {
    try {
      console.log(`[ToDoDB1Terminator] Received DB1 completion event for trackingId: ${event.trackingId}`);
      
      const todo = await toDoDB1Repository.getTodosForDB1Update(event.trackingId);
      if (!todo) {
          console.warn(`[ToDoDB1Terminator] Todo with trackingId ${event.trackingId} not found.`);
          return;
      }
      
      // We will now prepare the update object based on the current state.
      const updateObject = {
          isDB1Updated: true,
      };

      // Check if all prerequisites are met to mark the todo as fully done
      if (todo.isAddressPublished) {
          updateObject.isDone = true;
      }

      // Perform a single update operation
      await toDoDB1Repository.updateDB1Complete(event.trackingId);

      if (updateObject.isDone) {
        console.log(`[ToDoDB1Terminator] Marked to-do with trackingId ${event.trackingId} as fully done.`);
      } else {
        console.log(`[ToDoDB1Terminator] Marked DB1 update for ${event.trackingId}. Waiting for other stages.`);
      }
    } catch (err) {
      console.error('[ToDoDB1Terminator] Failed to terminate to-do:', err);
    }
  }

  /**
   * Cleans up the subscription.
   */
  static unsubscribe() {
    EventBus.unsubscribe(DB1SuccessfullyUpdatedEvent({}).type, this.handleEvent);
    console.log('[ToDoDB1Terminator] Unsubscribed from DB1SuccessfullyUpdated.');
  }
}