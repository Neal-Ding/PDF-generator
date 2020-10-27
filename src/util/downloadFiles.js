const CONFIG = require("../config/server.config");
const path = require('path');
const fs = require('fs');
const rp = require('request-promise-native');
const util = require("util");
const logger = require('../util/log');

fs.writeFile = util.promisify(fs.writeFile);

let downloadFiles = async resourceMap => {
    logger.info(`resourceMap=${JSON.stringify(resourceMap)}`);

    const fileNameHash = String(Number(new Date()) + Math.floor(Math.random() * 100));

    let distMap = {};
    for (let i in resourceMap) {
        if (!resourceMap.hasOwnProperty(i)) {
            return;
        }
        try {
            if (i !== 'pdfUrl' || (i === 'pdfUrl' && resourceMap[i][0] !== '/')) {
                fs.accessSync(resourceMap[i])
            }
            distMap[i] = resourceMap[i];
        } catch (e) {
            let downloadLink = createFullFMSLink(resourceMap[i]);
            let data = await rp(downloadLink, {
                encoding: null
            });
            fs.mkdirSync(CONFIG.resourcePath, {
                recursive: true
            });
            fs.writeFileSync(path.join(CONFIG.resourcePath, i + fileNameHash), data);
            distMap[i] = path.join(CONFIG.resourcePath, i + fileNameHash);
        }
    }
    return distMap
};

let createFullFMSLink = (fmsKey) => {
    if (fmsKey.indexOf("fms.you.163.com") !== -1 || fmsKey.indexOf("yxfms.hz.infra.mail") !== -1) {
        fmsKey = fmsKey.split('/').reverse()[0];
        return `http://${CONFIG.fmsConfig.host}/${CONFIG.fmsConfig.path}/${CONFIG.fmsConfig.product}/${CONFIG.fmsConfig.topic}/${fmsKey}`;
    } else if (/^\w+(=)?\.\w+/.test(fmsKey)) {
        return `http://${CONFIG.fmsConfig.host}/${CONFIG.fmsConfig.path}/${CONFIG.fmsConfig.product}/${CONFIG.fmsConfig.topic}/${fmsKey}`;
    } else {
        return fmsKey;
    }

}

module.exports = downloadFiles
