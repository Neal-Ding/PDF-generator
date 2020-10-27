const fs = require("fs");
const path = require("path");
const CONFIG = require("./src/config/server.config");

try {
    fs.mkdirSync(CONFIG.logPath, {
        recursive: true
    });

    fs.mkdirSync(CONFIG.dataPath, {
        recursive: true
    });
} catch (e) {
    console.log(e);
}

module.exports = {
    apps: [{
        name: "app",
        script: "./src/server.js",
        output: path.join(CONFIG.logPath, './output.log'),
        error: path.join(CONFIG.logPath, './error.log'),
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        env_local: {},
        env_test: {},
        env_online: {}
    }]
};
