var express = require('express');
var router = express.Router();
var { auth } = require('../firebase.js');

/* POST new user. */
router.post('/', async function(req, res, next) {
  if (!req.body.email) {
    res.status(400).json({
      message: "Empty email."
    });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({
      message: "Empty password."
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(400).json({
      message: "Password must be at least 6 characters long."
    });
    return;
  }

  if (!req.body.name) {
    res.status(400).json({
      message: "Empty name."
    });
    return;
  }

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
