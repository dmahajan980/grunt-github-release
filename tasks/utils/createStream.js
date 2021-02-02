const fs = require('fs');
const fetch = require('node-fetch');

module.exports = async (uploadUrl, asset, stats, accessToken) => {
  // Read the asset file from the system.
  const assetStream = fs.createReadStream(asset);

  // Upload the asset file.
  const assetRequestData = {
    method: 'POST',
    headers: {
      'content-type': 'application/zip',
      'content-length': stats.size,
      'Authorization': `Token ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: assetStream,
  };

  const { status } = await fetch(uploadUrl, assetRequestData);

  return status;
};
