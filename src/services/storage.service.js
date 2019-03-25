const {Storage} = require('@google-cloud/storage');
const config = require('config');

const projectID = config.get('projectID');
const bucketName = config.get('bucketName');
 
// Creates a client
const storage = new Storage({
  projectID: projectID,
  keyFilename: 'service-account-87s9f79a7fd96fs9ds7f.json'
});

// Creates the new bucket
function createBucket(newBucketName) {
    storage.createBucket(newBucketName).then(() => {
        console.log(`Bucket ${newBucketName} created.`);
    }).catch(err => {
        console.error('ERROR:', err);
    });
}

function listBuckets() {
    storage.getBuckets().then((results) => {
        const buckets = results[0];
  
        console.log('Buckets:');
        buckets.forEach((bucket) => {
            console.log(bucket.name);
        });
    }).catch((err) => {
        console.error('ERROR:', err);
    }); 
}

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

// Makes the file public
async function makePublic(filename) {
    let result = await storage
        .bucket(bucketName)
        .file(filename)
        .makePublic();

    console.log(`gs://${bucketName}/${filename} is now public.`);
    console.log('Make public result: ', result);
}

// module.exports.createBucket = createBucket;
// module.exports.listBuckets = listBuckets;
// module.exports.makePublic = makePublic;
module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;