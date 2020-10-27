const logger = require("../util/log");
const path = require('path');
const util = require('util');
const ejs = require('ejs');
const fs = require("fs");
const dayjs = require('dayjs');
const bwipjs = require('bwip-js');
const stream = require('stream');
const merge = require('deepmerge');
const html2pdf = require('../util/html2pdf');
const CONFIG = require("../config/server.config");
let browser = null;
bwipjs.toBuffer = util.promisify(bwipjs.toBuffer);

let __ejsHelper = {
    dayjs: dayjs,
    barcode: async (data) => {
        return bwipjs.toBuffer({
            bcid: 'code128',
            text: data,
            height: 10,
        }).then(res => {
            return 'data:image/png;base64,' + res.toString('base64');
        });
    }
};

let renderTemplate = async (templatePath = "", templateData = {}) => {
    logger.info(`templatePath=${templatePath}, templateData=${JSON.stringify(templateData).substring(0, 1000)}`);

    let templateContent = fs.readFileSync(templatePath).toString('utf-8');
    templateData.__ejsHelper = __ejsHelper;
    let templateRes = ejs.render(templateContent, templateData, {
        async: true
    });
    logger.info(`templateData generate success`);
    return templateRes;
};


let renderPDF = async (sourceData, option) => {
    if (browser == null) {
        browser = await html2pdf.init();
    }

    let PDFStream = new stream.PassThrough();
    let fileBuffer = await html2pdf.covert(browser, sourceData.content, sourceData.header, sourceData.footer, option);
    PDFStream.end(fileBuffer);

    return PDFStream;
};

let createPDFService = {
    generatePDFStream: async (templateId, templateData) => {
        let headerTemplatePath = path.join(CONFIG.resourcePath, `./template/${templateId}header.ejs`);
        let contentTemplatePath = path.join(CONFIG.resourcePath, `./template/${templateId}content.ejs`);
        let footerTemplatePath = path.join(CONFIG.resourcePath, `./template/${templateId}footer.ejs`);
        let PDFRequestData = {};

        if (fs.existsSync(headerTemplatePath)) {
            PDFRequestData.header = {
                template: headerTemplatePath,
                data: templateData
            }
        }

        if (fs.existsSync(contentTemplatePath)) {
            PDFRequestData.content = {
                template: contentTemplatePath,
                data: templateData
            }
        }

        if (fs.existsSync(footerTemplatePath)) {
            PDFRequestData.footer = {
                template: footerTemplatePath,
                data: templateData
            }
        }

        return await createPDFService.create(PDFRequestData);
    },
    // 外部接入，使用ejs https://ejs.co/#docs
    create: async (reqData, option = {}) => {
        logger.info(`PDF create with data: ${JSON.stringify(reqData).substring(0, 1000)}`);
        let PDFData = {};
        const defaultOption = {
            margin: {
                top: 50,
                left: 50,
                right: 50,
                bottom: 50
            }
        };

        if (reqData.header) {
            PDFData.header = await renderTemplate(reqData.header.template, reqData.header.data);
        }
        if (reqData.content) {
            PDFData.content = await renderTemplate(reqData.content.template, reqData.content.data);
        }
        if (reqData.footer) {
            PDFData.footer = await renderTemplate(reqData.footer.template, reqData.footer.data);
        }

        return renderPDF({
            ...PDFData
        }, merge(defaultOption, option));
    }
};

module.exports = createPDFService;
