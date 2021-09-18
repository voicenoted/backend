var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount = require("../firebase-thing.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const auth = admin.auth();

  auth
    .createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.name
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
});

module.exports = router;
