import {getLogger, LogRecord, setup} from "log";
import {ConsoleHandler} from "log/console-handler";

setup({
    handlers: {
        console: new ConsoleHandler('DEBUG', {
            formatter: (record: LogRecord) => {
                return `[${record.levelName}] ${record.msg}`;
            }
        })
    },
    loggers: {
        default: {
            level: 'DEBUG',
            handlers: ["console"]
        }
    }
});

const log = getLogger();
export default log;