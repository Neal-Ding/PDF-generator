const mime = require('mime');
const createExcelService = require('../service/createExcelService');

module.exports.generalExcel = (req, res) => {
    let fileStream;

    fileStream = createExcelService.covertFromJSON(
        req.body.data,
        req.body.fields,
        req.body.sheetName
    );
    if (fileStream) {
        res.set('Content-Type', mime.getType('xlsx'));
        fileStream.pipe(res)
    } else {
        res.status(404).send('Fail to generate Excel files!')
    }
}
