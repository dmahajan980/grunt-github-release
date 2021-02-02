const fetch = require('node-fetch');

module.exports = async (apiUrl, repo, accessToken) => {
  const REPOSITORY_URL = `https://github.com/${repo}`;

  // Check whether the project repository is accessible.
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Token ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    },
  });

  // Verify that the repository is accessible.
  if (response.status !== 200) {
    const errorTemplate =
      response.status === 404
        ? 'Could not find the repository'
        : 'Could not connect to the repository';

    throw new Error(`${errorTemplate}: ${REPOSITORY_URL}`);
  }
};
