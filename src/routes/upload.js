const express = require('express');
const router = express.Router();
const IncomingForm = require('formidable').IncomingForm;
const storageService = require('../services/storage.service');
const config = require('config');

const bucketName = config.get('bucketName');

router.post('/', async (req, res) => {
  var form = new IncomingForm();
  let srcFilename;
  let fileType;

  form.on('file', (field, file) => {
    file = file;
    srcFilename = file.path;
    fileType = file.type.replace('image/', '');
  });

  form.on('end', () => {
    let destFilename = `images/events/${srcFilename.replace("/tmp/upload_", "")}.${fileType}`;
    storageService.uploadFile(srcFilename, destFilename);

    res.json({'gcsPublicUrl': `https://storage.googleapis.com/${bucketName}/${destFilename}`});
  });

  form.parse(req);
});

router.delete('/', async (req, res) => {
  storageService.deleteFile(req.body.fileUrl);

  form.on('end', () => {
    res.json({});
  });

  form.parse(req);
});

module.exports = router;