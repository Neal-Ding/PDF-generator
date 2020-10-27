var fs = require('fs');
var archiver = require('archiver');
// https://www.npmjs.com/package/archiver
const stream = require('stream');

const compression = {
    zip(packageFileList) {
        // create a file to stream archive data to.
        let output = new stream.PassThrough();

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained');
        });

        var archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // pipe archive data to the file
        archive.pipe(output);

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            throw err;
        });

        packageFileList.forEach(packageFile => {
            packageFile.fname = packageFile.fname.replace("\/", "∕");
            if (packageFile.data.readable === true) {
                archive.append(packageFile.data, { name: packageFile.fname });
            } else if (typeof packageFile.data === "string") {
                archive.file(packageFile.data, { name: packageFile.fname });
                // fs.unlink(packageFile.data)
            }
        });
        archive.finalize();

        return output;
    }
}

module.exports = compression;
