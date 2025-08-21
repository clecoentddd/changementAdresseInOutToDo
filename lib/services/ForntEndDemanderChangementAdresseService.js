import { FrontEventStore } from '../stores/FrontEventStore';
import { OutboxStore } from '../stores/OutboxStore';
import { Event } from '../models/Event';
import { IdGenerator } from '../utils/IdGenerator';

export class FrontCommandService {
  static EVT_ADDRESS_CHANGED = 'addressChanged';

  static async createAccountAndAddress(name, address) {
    const accountId = IdGenerator.generate();
    await this.changeAddress(accountId, name, address);
    return accountId;
  }

  static async changeAddress(accountId, name, address) {
    const eventId = IdGenerator.generate();
    const trackingId = IdGenerator.generate();
    const payload = { accountId, name, address };
    const meta = { origin: 'front', slice: 'slice1-front-create' };
    const event = new Event(eventId, trackingId, this.EVT_ADDRESS_CHANGED, meta, payload);

    await FrontEventStore.append(event);
    await OutboxStore.append(event);
    return eventId;
  }
}
