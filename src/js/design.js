

import FSM from './sgen-sm';
import LOG from './logger';

class DesignMgr {
    constructor() {
        FSM.observe('onPrepareDesign', this.prepareDesign.bind(this));
        FSM.observe('onUpdateDesign', this.updateDesign.bind(this));
    }

    prepareDesign() {
        LOG.info('Setting up design');
    }

    updateDesign() {
        LOG.info('Updating design');
    }
}

const designMgr = new DesignMgr;

export default designMgr;
