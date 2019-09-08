import SM from 'javascript-state-machine';

const fsm = new SM({
    init: 'init',
    transitions: [
        { name: 'create_temp_directory', from: 'init', to: 'cwd_ready' },
        { name: 'prepare_design', from: 'cwd_ready', to: 'design_ready' },
        { name: 'prepare_packages', from: 'design_ready', to: 'packages_ready' },
        { name: 'generate_base_design', from: 'packages_ready', to: 'base_ready' },
        { name: 'update_design', from: 'base_ready', to: 'design_updated' },
        { name: 'update_packages', from: 'design_updated', to: 'packages_updated' },
        { name: 'regenerate_design', from: 'packages_updated', to: 'regenerated' },
        { name: 'cleanup', from: 'regenerated', to: 'done' }
    ]
});

export default fsm;
