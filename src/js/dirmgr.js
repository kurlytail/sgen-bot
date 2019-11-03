import FSM from './sgen-sm';
import LOG from './logger';
import tmp from 'tmp';

class DirMgr {
    constructor() {
        FSM.observe('onCreateTempDirectory', this.setupDirectories.bind(this));
        FSM.observe('onCleanup', this.teardownDirectories.bind(this));
    }

    setupDirectories() {
        this.tmpDir = tmp.dirSync();
        LOG.info(`Created temporary directory ${this.tmpDir.name}`);
    }

    teardownDirectories() {
        LOG.info(`Deleting temporary directory ${this.tmpDir.name}`);
        //this.tmpDir.removeCallback();
    }

    get workingDirectory() {
        return this.tmpDir.name;
    }
}

const dirmgr = new DirMgr();

export default dirmgr;
