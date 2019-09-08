import winston from 'winston';
import { format } from 'logform';
import FSM from './sgen-sm';

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: format.simple()
});

FSM.observe('onTransition', attrib => logger.debug(`${attrib.from} -> ${attrib.transition} -> ${attrib.to}`));
export default logger;
