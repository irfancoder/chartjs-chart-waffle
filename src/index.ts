import { registry } from 'chart.js'
import { WaffleController } from './controllers';
import { WaffleElement } from './elements';

export * from '.';
registry.addControllers(WaffleController);
registry.addElements(WaffleElement);
