var express = require('express');
var router = express.Router();
var { db, auth } = require('../firebase.js');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* POST new note. */
router.post('/', async function(req, res, next) {
  // if (req.body.token === undefined) {
  //   res.status(401).json({
  //     message: "Access token required."
  //   });
  //   return;
  // }

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

  if (req.body.audioLink === undefined) {
    res.status(400).json({
      message: "Empty audioLink."
    });
    return;
  }


  // auth
  //   .verifyIdToken(req.body.token)
  //   .then((decodedToken) => {
  //     const uid = decodedToken.uid;
      // store note in firebase

      // temp for demo :)
      let uid = 123;

      let note = {
        uid: uid,
        audioid: req.body.audioid,
        timestamp: {
          start: req.body.timestamp.start,
          end: req.body.timestamp.end
        },
        content: req.body.content,
        audioLink: req.body.audioLink
      }

      db.collection("notes").add(note)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        note.id = docRef.id

        res.status(200).json(note);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);

        res.status(500).json({
          message: error
        });
      });
    // })
    // .catch((error) => {
    //   res.status(401).json({
    //     message: "Not authorized."
    //   });
    //   return;
    // });
});

module.exports = router;
