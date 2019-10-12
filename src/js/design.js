import FSM from './sgen-sm';
import LOG from './logger';
import FSE from 'fs-extra';
import DIRMGR from './dirmgr';
import yaml from 'yaml';
import FS from 'fs';

class DesignMgr {
    constructor() {
        FSM.observe('onPrepareDesign', this.prepareDesign.bind(this));
        FSM.observe('onUpdateDesign', this.updateDesign.bind(this));
        FSM.observe('onGenerateDesign', this.generateDesign.bind(this));
    }

    generateNewOptions() {
        FSE.ensureFileSync('.sgen-bot.yml');

        const sgenDef = yaml.parse(FS.readFileSync('.sgen-bot.yml', 'utf8'));
        sgenDef.design = sgenDef.design || ['design.yml'];
        sgenDef.generator = sgenDef.generator || ['log'];

        sgenDef.design.forEach(designFile => FSE.ensureFileSync(designFile));
        FS.writeFileSync('.sgen-bot.yml', yaml.stringify(sgenDef), 'utf8');

        sgenDef.design.forEach(designFile => {
            LOG.info(`Copying ${designFile}`);
            FSE.copySync(designFile, DIRMGR.workingDirectory + '/' + designFile);
        });
    }

    generateLastOptions() {
        FSE.ensureFileSync('.sgen-logs/options.json');
        FSE.ensureFileSync('.sgen-logs/packages.json');

        const lastSgenDef = JSON.parse(FS.readFileSync('.sgen-logs/options.json', 'utf8'));

        lastSgenDef.map = lastSgenDef.map || [];
        lastSgenDef.extensions = lastSgenDef.extensions || [];
        lastSgenDef.map = lastSgenDef.map.filter(entry => !entry.includes('.nvm/versions/node'));
        lastSgenDef.extensions = lastSgenDef.extensions.filter(entry => !entry.includes('.nvm/versions/node'));
        lastSgenDef.design = ['.sgen-logs/design.json'];
        lastSgenDef.generator = lastSgenDef.generator || [];

        FS.writeFileSync(DIRMGR.workingDirectory + '/.sgen-bot.yml', yaml.stringify(lastSgenDef), 'utf8');
    }

    prepareDesign() {
        LOG.info('Setting up design');

        FSE.ensureDirSync('.sgen-logs');

        this.generateNewOptions();
        this.generateLastOptions();

        LOG.info('Copying .sgen-logs');
        FSE.copySync('.sgen-logs', DIRMGR.workingDirectory + '/.sgen-logs');
    }

    updateDesign() {
        LOG.info('Updating design');
        FSE.copySync('.sgen-bot.yml', DIRMGR.workingDirectory + '/.sgen-bot.yml');
    }

    generateDesign() {
        LOG.info('Generating design');
    }
}

const designMgr = new DesignMgr();

export default designMgr;
