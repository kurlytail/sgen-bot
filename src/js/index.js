import FSM from './sgen-sm';
import './logger';
import './dirmgr';
import './design';
import './pkgmgr';

FSM.createTempDirectory();
FSM.prepareDesign();
FSM.preparePackages();
FSM.generateDesign();
FSM.updateDesign();
FSM.preparePackages();
FSM.generateDesign();
FSM.cleanup();
