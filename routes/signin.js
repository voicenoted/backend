var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount = require("../firebase-thing.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/* GET users listing. */
router.get('/', async function(req, res, next) {

  console.log("asdfahsdufaij")

  const auth = admin.auth();

  auth
    .createUser({
      uid: 'some-uid',
      email: 'user@example.com',
      phoneNumber: '+11234567890',
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
