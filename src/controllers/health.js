const mime = require('mime');

module.exports.index = (req, res) => {
    // todo: check db, chromium
    res.set('Content-Type', mime.getType('json'));
    res.send({code: 200})
}
