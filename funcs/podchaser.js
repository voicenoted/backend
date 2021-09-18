var express = require('express');
var router = express.Router();
var { GraphQLClient, gql } = require('graphql-request');

require('dotenv').config()

async function request(endpoint, query) {

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer ' + process.env.ACCESS_TOKEN,
    }
  });

  return await graphQLClient.request(query);
};

module.exports = { request };