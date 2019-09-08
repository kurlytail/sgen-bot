import FSM from './sgen-sm';
import './logger';
import './dirmgr';
import './design';

FSM.createTempDirectory();
FSM.prepareDesign();
FSM.preparePackages();
FSM.generateDesign();
FSM.updateDesign();
FSM.preparePackages();
FSM.generateDesign();
FSM.cleanup();
