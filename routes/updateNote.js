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

  if (req.body.noteid === undefined) {
    res.status(400).json({
      message: "Undefined noteid."
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

      // db.collection('notes').where(db.firestore.FieldPath.documentId(), '==', req.body.noteid).get().then((doc) => {
      //   if (doc.exists) {
      //     console.log("Document data:", doc.data());

          let updatedStuff = {}

          if (req.body.audioid !== undefined) updatedStuff.audioid = req.body.audioid;
          if (req.body.audiolink !== undefined) updatedStuff.audiolink = req.body.audiolink;
          if (req.body.timestamp !== undefined) updatedStuff.timestamp = req.body.timestamp;
          if (req.body.content !== undefined) updatedStuff.content = req.body.content;

          db.collection("notes").doc(req.body.noteid).update(updatedStuff)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
    
            res.status(200).json(updatedStuff);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
    
            res.status(500).json({
              message: error
            });
          });
      //   } else {
      //     console.log("No such document!");

      //     res.status(400).json({
      //       message: "No document with id exists."
      //     });
      //     return;
      //   }
      // }).catch((error) => {

      //   res.status(500).json({
      //     message: error
      //   });
      //   return;
      // });
    // })
    // .catch((error) => {
    //   res.status(401).json({
    //     message: "Not authorized."
    //   });
    //   return;
    // });
});

module.exports = router;
