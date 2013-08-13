define(function (require) {
  'use strict';
  /*global console:false */

  var _      = require('underscore'),
      config = require('config');

  // Public Methods
  // **************

  var info = function (message) {
    _send('INFO', message);
  };
  var warn = function (message) {
    _send('WARN', message);
  };
  var error = function (message) {
    _send('ERROR', message);
  };
  var debug = function (message) {
    _send('DEBUG', message);
  };

  // Private Methods
  // ***************

  var _send = function (level, message) {
    _localSend(level, message);
  };

  var _localSend = function (level, message) {

    if (typeof console !== 'object') { return; }

    if (typeof message === 'object') {
      _serializeObject(message);
    }
    else {
      console.log(config.loggingPrefix() + message);
    }
  };

  var _serializeObject = function (message) {
    // Use this when we are running in dumb environments that can't do
    // console.dir properly (e.g. android eclipse logcat). The output of this is
    // not as nice as console.dir() but is better than the default.

    // Some environments report that console.dir() exists even though it
    // doesn't work so we conservatively only use it if we are in the 'web'
    // environment.
    if (config.isWeb()) {
      console.log(config.loggingPrefix() + 'OBJECT:');
      console.dir(message);
      return;
    }

    // Keeping track of what we have seen prevents circular reference problems
    var seen = [];

    var output = JSON.stringify(message, function (key, val) {
      if (typeof val === 'object') {
        if (seen.indexOf(val) >= 0) {
          return undefined;
        }
        seen.push(val);
      }
      return val;
    }, true);

    // Log out our serialized string
    console.log(config.loggingPrefix() + 'SERIALIZED OBJECT:');
    _.each(output.split('\n'), function (line) {
      console.log(line);
    });
  };

  return {
    info: info,
    warn: warn,
    error: error,
    debug: debug
  };
});
