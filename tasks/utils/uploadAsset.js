const fs = require('fs');
const path = require('path');
const createStream = require('./createStream');

// Uploads the asset file to the newly-created release.
module.exports = (releaseId, asset, repo, accessToken) => {
  const assetBase = path.basename(asset);

  // Set the URL and the request parameters for asset upload.
  const UPLOAD_API = 'https://uploads.github.com';
  const ASSET_UPLOAD_URL = `
    ${UPLOAD_API}/repos/${repo}/releases/${releaseId}/assets?name=${assetBase}
  `;

  // Obtain characteristics of the asset file.
  return new Promise((resolve, reject) => {
    fs.stat(asset, (error, stats) => {
      if (error) {
        reject(error);
      }

      createStream(ASSET_UPLOAD_URL, asset, stats, accessToken).then((status) => {
        // Register failure in the "Upload Asset" process.
        if (status !== 201) {
          reject(`The asset file "${assetBase}" could not be uploaded.`);
        }

        // Indicate that the task has completed.
        resolve(`The asset file "${assetBase}" has been uploaded successfully.`);
      });
    });
  });
};
