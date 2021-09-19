var express = require('express');
var router = express.Router();
var { db } = require('../firebase.js');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* GET notes by user and audioid. */
router.get('/', async function(req, res, next) {
  // if (req.body.token === undefined) {
  //   res.status(401).json({
  //     message: "Access token required."
  //   });
  //   return;
  // }

  if (req.body.audioid === undefined) {
    res.status(401).json({
      message: "Undefined audioid."
    });
    return;
  }

  // admin
  //   .auth()
  //   .verifyIdToken(req.body.token)
  //   .then((decodedToken) => {
  //     const uid = decodedToken.uid;

      // temp for demo :)
      let uid = 123;
      db.collection("notes").where("uid", "==", uid, "&&").where("audioid", "==", req.body.audioid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
            });
            res.status(200).json(querySnapshot.docs.map(doc => doc.data()));
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);

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
