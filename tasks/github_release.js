/*
 * grunt-github-release
 * https://github.com/divyanshu98/grunt-github-release
 *
 * Copyright (c) 2021 Divyanshu Mahajan
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const checkRepo = require('./utils/checkRepo');
const createRelease = require('./utils/createRelease');
const uploadAsset = require('./utils/uploadAsset');

module.exports = function (grunt) {
  grunt.registerTask(
    'githubRelease',
    'A Grunt plugin to automate the process of creating a GitHub release for your project.',
    async function () {
      // Callback to be triggered after the asynchronous task is completed.
      const done = this.async();

      const { repo, asset, releaseData, accessToken } = this.options();
      const RELEASE_API = `https://api.github.com/repos/${repo}/releases`;

      // Check whether the authentication token isn't supplied.
      if (!accessToken) {
        grunt.log.error('GitHub access token cannot be found.');
        return;
      }

      try {
        // Initiate the release creation process.
        grunt.log.subhead('Connecting to GitHub...');

        await checkRepo(RELEASE_API, repo, accessToken);
        grunt.log.ok('The connection has been established.');

        // Create a release if the repository is accessible.
        grunt.log.subhead(`Creating new release "${releaseData.tagName}" on GitHub...`);
        const { releaseId, releaseUrl } = await createRelease(
          RELEASE_API,
          releaseData,
          accessToken
        );
        grunt.log.ok(`The release has been created at ${releaseUrl}`);

        if (asset) {
          // Verify the asset file.
          if (!grunt.file.exists(asset)) {
            throw new Error(`The asset file "${assetBase}" does not exist.`);
          } else if (!asset.includes('.zip')) {
            throw new Error(`The asset "${assetBase}" is not a "zip" file.`);
          }

          // Start uploading the asset file to the created release.
          grunt.log.subhead(
            `Scanning and uploading asset file "${path.basename(asset)}"...`
          );
          const uploadStatus = await uploadAsset(releaseId, asset, repo, accessToken);
          grunt.log.ok(uploadStatus);
        }

        done();
      } catch (errorMsg) {
        grunt.log.error(errorMsg);
        done(false);
      }
    }
  );
};
