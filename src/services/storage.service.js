const {Storage} = require('@google-cloud/storage');
const config = require('config');

const projectID = config.get('projectID');
const bucketName = config.get('bucketName');
 
// Creates a client
const storage = new Storage({
  projectID: projectID,
  keyFilename: 'torowdog-90d80c4a8bd6.json'
});

async function uploadFile(srcFilename, destFilename) {
    // Uploads a local file to the bucket
    const options = {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // The path to which the file should be uploaded, e.g. "file_encrypted.txt"
        destination: destFilename,
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        }
    };

    let res = await storage.bucket(bucketName).upload(srcFilename, options);
    console.log(`${srcFilename} uploaded to ${bucketName}.`);
    return res;
}

async function deleteFile(fileUrl) {
    let filename = fileUrl.replace(`https://storage.googleapis.com/${bucketName}/`, '');
    // Deletes the file from the bucket
    await storage
      .bucket(bucketName)
      .file(filename)
      .delete();

    console.log(`gs://${bucketName}/${filename} deleted.`);
}

module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;