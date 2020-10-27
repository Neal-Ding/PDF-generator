const healthController = require('./controllers/health');
const pdfCreateController = require('./controllers/pdfCreate');
const excelCreateController = require('./controllers/excelCreate');
require('express-async-errors');
// todo: support docx template
// https://www.npmjs.com/package/docx-templates

let wrap = (app) => {
    // healthCheck
    app.get('/i/health', healthController.index);
    // createPDF
    app.post('/api/pdf/create', pdfCreateController.generalPDF);
    // createExcel
    app.post('/api/excel/create', excelCreateController.generalExcel);
}

module.exports = wrap;
