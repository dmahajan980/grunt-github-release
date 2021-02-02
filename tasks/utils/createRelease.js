const fetch = require('node-fetch');

// Creates a release in the repository.
module.exports = async (apiUrl, releaseData, accessToken) => {
  const requestData = {
    method: 'POST',
    headers: {
      Authorization: `Token ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      tag_name: releaseData.tagName,
      name: releaseData.name,
      body: releaseData.body,
      draft: releaseData.draft,
      prerelease: releaseData.prerelease,
    }),
  };

  const response = await fetch(apiUrl, requestData);
  const parsedRes = await response.json();

  // Announce failure if the release could not be created.
  if (response.status !== 201) {
    const errorMsg =
      response.status === 422 && parsedRes.errors[0].code === 'already_exists'
        ? `A release with the tag "${releaseData.tagName}" already exists.`
        : 'The release could not be created.';
    throw new Error(errorMsg);
  }

  return {
    releaseId: parsedRes.id,
    releaseUrl: parsedRes.html_url,
  };
};
