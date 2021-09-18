var express = require('express');
var router = express.Router();
var { db } = require('../firebase.js');

/* POST new note. */
router.post('/', async function(req, res, next) {
  if (!req.header.token) {
    res.status(401).json({
      message: "Access token required."
    });
    return;
  }

  if (!req.body.timestamp) {
    res.status(400).json({
      message: "Empty timestamp."
    });
    return;
  }

  if (!req.body.timestamp.start) {
    res.status(400).json({
      message: "Empty timestamp start."
    });
    return;
  }

  if (!req.body.audioid) {
    res.status(400).json({
      message: "Empty audioid."
    });
    return;
  }


  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // store note in firebase

      // temp
      // let uid = 1093458
      // req.body.timestamp = {
      //   start: 0,
      //   end: 5543
      // }
      // req.body.content = "cool content"

      db.collection("notes").add({
        uid: uid,
        audioid: req.body.audioid,
        timestamp: {
          start: req.body.timestamp.start,
          end: req.body.timestamp.end
        },
        content: req.body.content
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    })
    .catch((error) => {
      res.status(401).json({
        message: "Not authorized."
      });
      return;
    });
});

module.exports = router;
