const path = require("path");
const merge = require('deepmerge');

const productionName = "yanxuan-qc-pdf";
const commonConfig = {
    sentry_DSN: "https://2e649f5f349342c9b70fc9e55224ae13@o236596.ingest.sentry.io/5417490",
}
const envConfig = {
    "local": {
        "port": 9001,
        "logPath": path.join(__dirname, '../../logs/'),
        "dataPath": path.join(__dirname, `../../res/`),
        // null for use node_moules binary
        "executablePath": null,
        "resourcePath": path.join(__dirname, '../resource/')
    },
    "test": {
        "port": 8080,
        "logPath": `/home/logs/${productionName}/`,
        "dataPath": `/home/webdata/${productionName}/`,
        "executablePath": path.join(__dirname, '../../extension/chrome-linux/chrome'),
        "resourcePath": path.join(__dirname, '../resource/')
    },
    "online": {
        "port": 8080,
        "logPath": `/home/logs/${productionName}/`,
        "dataPath": `/home/webdata/${productionName}/`,
        "executablePath": path.join(__dirname, '../../extension/chrome-linux/chrome'),
        "resourcePath": path.join(__dirname, '../resource/')
    }
};

module.exports = merge(commonConfig, envConfig[process.env.NODE_ENV]);
