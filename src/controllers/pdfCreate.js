const mime = require('mime');
const createPDFService = require('../service/createPDFService');

module.exports.generalPDF = async (req, res) => {
    let fileStream = await createPDFService.generatePDFStream(
        req.body.templateId,
        req.body.templateData
    );
    if (fileStream) {
        res.set('Content-Type', mime.getType('pdf'));
        fileStream.pipe(res)
    } else {
        res.status(404).send('Fail to generate PDF files!')
    }
}
