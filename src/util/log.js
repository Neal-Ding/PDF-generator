const log4js = require('log4js');
//wiki: https://log4js-node.github.io/log4js-node/index.html
const path = require('path');
const serverUtil = require('./serverUtil');
const CONFIG = require("../config/server.config");
// https://github.com/JetBrains/ideolog/wiki/Custom-Log-Formats

log4js.configure({
    pm2: true,
    appenders: {
        server: {
            type: 'dateFile',
            filename: path.join(CONFIG.logPath, 'app.log'),
            pattern: '.yyyy-MM-dd',
            daysToKeep: 14,
            compress: true,
            alwaysIncludePattern: true,
            keepFileExt: true,
            layout: {
                type: 'pattern',
                tokens: {
                    traceId() {
                        return serverUtil.getTraceId();
                    }
                },
                pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] [%x{traceId}] %m'
            }
        }
    },
    categories: {
        default: {appenders: ['server'], level: 'debug'}
    }
});

module.exports = log4js.getLogger();
