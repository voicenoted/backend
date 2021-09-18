var express = require('express');
var router = express.Router();
var { db } = require('../firebase.js');

/* GET notes by user and audioid. */
router.get('/', async function(req, res, next) {
  if (!req.header.token) {
    res.status(401).json({
      message: "Access token required."
    });
    return;
  }

  if (!req.body.audioid) {
    res.status(401).json({
      message: "Undefined audioid."
    });
    return;
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;

      // temp
      // let uid = 1093458
      // req.body.audioid = 2
      // get notes
      db.collection("notes").where("uid", "==", uid, "&&").where("audioid", "==", req.body.audioid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
            });
            res.end(JSON.stringify(querySnapshot.docs.map(doc => doc.data())))
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
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
