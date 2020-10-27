const logger = require("../util/log");
const json2xlsx = require("../util/json2xlsx");
// https://github.com/SheetJS/js-xlsx
const stream = require("stream");

let createExcelService = {
    covertFromJSON: (data, fields = [], sheetName) => {
        let commonFields = {};
        let option = {}
        let fieldsList = [];

        fields.forEach(field => {
            let key = null;
            let value = null;

            if (typeof field === 'string') {
                key = field;
                value = field;
            } else if (typeof field === 'object') {
                key = field.key;
                value = field.text;
            }
            commonFields[key] = value;
            fieldsList.push(value);
        });
        option.header = fieldsList;
        let dataUnderFields = data.map(item => {
            let itemNeeded = {};
            for (let i in item) {
                if (commonFields.hasOwnProperty(i)) {
                    itemNeeded[commonFields[i]] = String(item[i]);
                }
            }
            return itemNeeded;
        })

        let json2xlsxBuffer = json2xlsx.convert(dataUnderFields, sheetName, option)
        let xlsStream = new stream.PassThrough();
        xlsStream.end(json2xlsxBuffer);

        logger.info(`create excel success`);
        return xlsStream;
    }
}

module.exports = createExcelService
