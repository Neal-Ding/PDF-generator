const CONFIG = require("../config/server.config");
const fs = require('fs');
const path = require('path');
const logger =  require("./log");
const puppeteer = require("puppeteer");
// wiki: https://pptr.dev/

const defaultTemplate = "<div></div>";
const pageSize = {
    "A4": {
        width: 827,
        height: 1170
    }
};

const html2pdf = {
    init: async function () {
        return await puppeteer.launch({
            executablePath: CONFIG.executablePath,
            args: ['--no-sandbox', '--disable-namespace-sandbox', '--disable-setuid-sandbox']
        });
    },
    destroy: function (browser) {
        browser.close();
    },
    covert: async function (browser, content = defaultTemplate, header = defaultTemplate, footer = defaultTemplate, option = {}) {
        const distFolderPath = path.join(CONFIG.dataPath, 'html2pdf');
        fs.mkdirSync(distFolderPath, {
            recursive: true
        })
        if (process.env.NODE_ENV === "local") {
            if (header !== defaultTemplate) {
                fs.writeFileSync(path.join(distFolderPath, `./tempHeader.html`), header);
            }
            if (footer !== defaultTemplate) {
                fs.writeFileSync(path.join(distFolderPath, `./tempFooter.html`), footer);
            }
            if (content !== defaultTemplate) {
                fs.writeFileSync(path.join(distFolderPath, `./tempContent.html`), content);
            }
        }

        const page = await browser.newPage();
        await page.setViewport({
            width: pageSize.A4.width - option.margin.left - option.margin.right,
            height: pageSize.A4.height - option.margin.top - option.margin.bottom
        });
        await page.setContent(content, {waitUntil: 'load'});
        let fileBuffer = await page.pdf({
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: header,
            footerTemplate: footer,
            width: pageSize.A4.width,
            height: pageSize.A4.height,
            margin: option.margin
        });
        page.close();
        logger.info(`create pdf success`);
        return fileBuffer;
    }
};

module.exports = html2pdf;
