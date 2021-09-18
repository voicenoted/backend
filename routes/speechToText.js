var express = require('express');
var router = express.Router();
const Multer = require('multer');

const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');

const storage = new Storage();
const multer = Multer({ storage: Multer.memoryStorage() });
const bucket = storage.bucket('voicenoted-speech-to-text');
const speechClient = new speech.SpeechClient();

async function getTranscription() {

  const audio = {
    uri: 'gs://voicenoted-speech-to-text/audio.flac',
  };
  const config = {
    encoding: 'FLAC',
    // sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await speechClient.recognize(request);
  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  return transcription;
}

router.post('/', multer.single('file'), async function(req, res, next) {

  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', async () => {
    res.status(200).send(await getTranscription());
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
