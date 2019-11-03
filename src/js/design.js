import FSM from './sgen-sm';
import LOG from './logger';
import FSE from 'fs-extra';
import DIRMGR from './dirmgr';
import yaml from 'yaml';
import FS from 'fs';
import CP from 'child_process';

class DesignMgr {
    constructor() {
        FSM.observe('onPrepareDesign', this.prepareDesign.bind(this));
        FSM.observe('onUpdateDesign', this.updateDesign.bind(this));
        FSM.observe('onGenerateDesign', this.generateDesign.bind(this));
    }

    generateNewOptions() {
        FSE.ensureFileSync('.sgen-bot.yml');

        /* Seed the design if does not exist */
        const sgenDef = yaml.parse(FS.readFileSync('.sgen-bot.yml', 'utf8'));
        sgenDef.design = sgenDef.design || ['design.yml'];
        sgenDef.generator = sgenDef.generator || ['log'];

        /* Make sure all design files exist */
        sgenDef.design.forEach(designFile => FSE.ensureFileSync(designFile));
        /* Write the .sgen-bot file */
        FS.writeFileSync('.sgen-bot.yml', yaml.stringify(sgenDef), 'utf8');

        /* Copy design files to working diretory */
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
        LOG.info('Updating design -- ' + process.cwd());
        FSE.copySync('.sgen-bot.yml', DIRMGR.workingDirectory + '/.sgen-bot.yml');
        /* Remove old options */
        FSE.removeSync(DIRMGR.workingDirectory + '/.sgen-logs/options.json');
        FSE.removeSync(DIRMGR.workingDirectory + '/.sgen-logs/packages.json');
    }

    generateDesign() {
        LOG.info('Generating design');

        const cwd = process.cwd();
        process.chdir(DIRMGR.workingDirectory);

        if (FS.existsSync(DIRMGR.workingDirectory + '/.sgen-logs/options.json')) {
            CP.execSync(DIRMGR.workingDirectory + '/node_modules/.bin/sgen -p .sgen-logs/options.json');
        } else {
            CP.execSync(DIRMGR.workingDirectory + '/node_modules/.bin/sgen -p .sgen-bot.yml');
        }

        process.chdir(cwd);
    }
}

const designMgr = new DesignMgr();

export default designMgr;
