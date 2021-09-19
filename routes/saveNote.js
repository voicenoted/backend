var express = require('express');
var router = express.Router();
var { db, auth } = require('../firebase.js');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Token');
  next();
});

/* POST new note. */
router.post('/', async function(req, res, next) {
  if (req.body.token === undefined) {
    res.status(401).json({
      message: "Access token required."
    });
    return;
  }

  if (req.body.timestamp === undefined) {
    res.status(400).json({
      message: "Empty timestamp."
    });
    return;
  }

  if (req.body.timestamp.start === undefined) {
    res.status(400).json({
      message: "Empty timestamp start."
    });
    return;
  }

  if (req.body.audioid === undefined) {
    res.status(400).json({
      message: "Empty audioid."
    });
    return;
  }


  auth
    .verifyIdToken(req.body.token)
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
