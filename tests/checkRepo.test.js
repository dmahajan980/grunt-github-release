'use strict';

const grunt = require('grunt');
const nock = require('nock');
const test = require('ava');
const checkRepo = require('../tasks/utils/checkRepo');

test.before((t) => {
  t.context.repo = 'dummyUser/dummyRepo';
  t.context.accessToken = '123456789';
  t.context.API_URL = `https://api.github.com/${t.context.repo}/releases`;
});

test('Should establish connection with correct parameters', async (t) => {
  t.plan(3);

  const mockServer = nock('https://api.github.com', {
    reqheaders: {
      Authorization: `Token ${t.context.accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .get(`/${t.context.repo}/releases`)
    .reply(200);

  t.assert(mockServer, 'Mock server with same access token should have been created.');

  const response = await checkRepo(
    t.context.API_URL,
    t.context.repo,
    t.context.accessToken
  );

  t.true(mockServer.isDone(), 'Should make request to the GitHub API.');
  t.is(
    response,
    'The connection has been established.',
    'Should return correct response with valid authentication token and repository address.'
  );
});
