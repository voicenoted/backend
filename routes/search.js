var { request } = require('./../funcs/podchaser');

var express = require('express');
var router = express.Router();

var { GraphQLClient, gql } = require('graphql-request');

/* GET users listing. */
router.get('/', async function(req, res, next) {

  let data = await request('https://api.podchaser.com/graphql', gql`
    query {
      podcasts {
        data {
          title,
          description,
          url
        }
      }
    }
  `);

  res.send(data);
});

module.exports = router;
