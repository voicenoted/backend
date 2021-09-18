var express = require('express');
var router = express.Router();
const Multer = require('multer');
const ffmpeg = require('ffmpeg');

const { Storage } = require('@google-cloud/storage');
const { SpeechClient } = require('@google-cloud/speech');

const bucketName = 'voicenoted-speech-to-text';
const uploadDir = './uploads';

const storage = new Storage();
const speechClient = new SpeechClient();

const multer = Multer({
  storage: Multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      callback(null, Date.now() + '.flac')
    }
  })
});

const cropAudio = async (fileName, startTime, endTime) => {

  const croppedFileName = 'tmp_' + fileName;

  return new Promise((resolve, reject) => {
    try {
      var process = new ffmpeg(`${uploadDir}/${fileName}`);
      process.then((file) => {
        file
        .setVideoStartTime(startTime)
        .setVideoDuration(endTime - startTime)
        .save(`${uploadDir}/${croppedFileName}`, (error, file) => {
          if (error) {
            reject({ result: error });
          }
          resolve(croppedFileName);
        });
      }, (err) => {
        reject({ result: err });
      });
    } catch (err) {
      reject({ result: err.msg });
    }
  });
}

const speechToText = async (fileName) => {

  const request = {
    audio: {
      uri: `gs://${bucketName}/${fileName}`,
    },
    config: {
      encoding: 'FLAC',
      languageCode: 'en-US',
    },
  };

  const [response] = await speechClient.recognize(request);
  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  return transcription;
}

router.post('/', multer.single('file'), async (req, res, next) => {

  if (!req.file || !req.body) {
    res.status(400).json({ result: 'No file uploaded.' });
    return;
  }

  const fileName = req.file.filename;
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    res.status(400).json({ result: 'Missing start time and/or end time.' });
    return;
  }

  await cropAudio(fileName, startTime, endTime).then(async (croppedFileName) => {

    await storage.bucket(bucketName).upload(`${uploadDir}/${croppedFileName}`, {
      destination: fileName
    });
    res.status(200).json({ result: await speechToText(fileName) });

  }).catch(err => {
    res.status(400).json(err);
  });
});

module.exports = router;
