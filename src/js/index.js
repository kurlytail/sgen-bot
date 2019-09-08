import FSM from './sgen-sm';
import './logger';

FSM.createTempDirectory();
FSM.prepareDesign();
FSM.preparePackages();
FSM.generateBaseDesign();
FSM.updateDesign();
FSM.updatePackages();
FSM.regenerateDesign();
FSM.cleanup();
