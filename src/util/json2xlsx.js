const xlsx = require("xlsx");

const json2xlsx = {
    convert: (data, sheetName = "default", option) => {
        /* generate workbook */
        let workSheet = xlsx.utils.json_to_sheet(data, option);
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, workSheet, sheetName);

        /* generate buffer */
        return xlsx.write(wb, {type: 'buffer', bookType: "xlsx"});
    }
}

module.exports = json2xlsx
