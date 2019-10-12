import FSM from './sgen-sm';
import LOG from './logger';
import rimraf from 'rimraf';
import DIRMGR from './dirmgr';
const { execSync } = require('child_process');
import FS from 'fs';

class PkgMgr {
    constructor() {
        FSM.observe('onPreparePackages', this.preparePackages.bind(this));
    }

    preparePackages() {
        LOG.info('Preparing packages');

        const cwd = process.cwd();
        process.chdir(DIRMGR.workingDirectory);

        rimraf.sync('.node_modules');
        rimraf.sync('package-lock.json');

        const options = JSON.parse(FS.readFileSync('.sgen-logs/options.json', 'utf8')) || {};
        const packages = JSON.parse(FS.readFileSync('.sgen-logs/packages.json', 'utf8')) || {};

        const versionedPackages = Object.keys(packages);
        const generatorPackages = options.generator || [];
        const unversionedPackages = generatorPackages.filter(x => !versionedPackages.includes(x));

        if (versionedPackages.length) {
            const installPackages = versionedPackages
                .map(pkg => `${packages[pkg].packageName}@${packages[pkg].version}`)
                .join(' ');
            LOG.info(`Installing packages ${installPackages}`);
            execSync(`npm install ${installPackages}`);
        }

        if (unversionedPackages.length) {
            const installPackages = unversionedPackages.join(' ');
            LOG.info(`Installing packages ${installPackages}`);
            execSync(`npm install ${installPackages}`);
        }

        process.chdir(cwd);
    }
}

const pkgmgr = new PkgMgr();

export default pkgmgr;
