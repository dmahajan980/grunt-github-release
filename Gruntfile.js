/*
 * grunt-github-release
 * https://github.com/divyanshu98/grunt-github-release
 *
 * Copyright (c) 2021 Divyanshu Mahajan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    githubRelease: {},

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  // grunt.registerTask('test', ['clean', 'githubRelease', 'nodeunit']);
  grunt.registerTask('test', ['clean', 'githubRelease']);

  // By default, lint and run all tests.
  grunt.registerTask('default', 'githubRelease');
};
