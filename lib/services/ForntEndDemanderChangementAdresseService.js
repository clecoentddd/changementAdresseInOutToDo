import { FrontEventStore } from '../stores/FrontEventStore';
import { OutboxStore } from '../stores/OutboxStore';
import { CompteEtAdresseSoumis } from '../events/CompteEtAdresseSoumisEvent';
import { IdGenerator } from '../utils/IdGenerator';
import { EventBus} from '../infrastructure/EventBus';

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

    const event = new CompteEtAdresseSoumis({eventId, trackingId, meta, payload});


    await FrontEventStore.append(event);
    await OutboxStore.append(event);
    EventBus.publish(event);
    return eventId;
  }
}
