var express = require('express');
var router = express.Router();
var { auth } = require('../firebase.js');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* POST new user. */
router.get('/', async function(req, res, next) {

  auth
  .createCustomToken('some-uid')
  .then((customToken) => {
    res.send(customToken);
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
});

module.exports = router;
