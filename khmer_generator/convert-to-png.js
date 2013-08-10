/*globals $:false, console:false, require:false, phantom:false */
'use strict';

// usage: phantomjs convert-to-png.js "text to convert" "/path/to/output.png"

var system = require('system');
var page = require('webpage').create();

// echo messages on the page console to our console
page.onConsoleMessage = function (msg) {
  console.log('PAGE CONSOLE MSG:' + msg);
};

// Capture cmd line args
// *********************
if (system.args.length !== 3) {
  console.log('Usage: phantomjs convert-to-png.js "text to display" "/path/to/output.png"');
  phantom.exit(1);
}

var khmer = system.args[1];
var outputPath = system.args[2];

// console.log('Text to convert: ' + khmer);
// console.log('Output file: ' + outputPath);

// Run the conversion
// ******************

page.open('./template.html', function () {
  var dimensions = {};

  dimensions = page.evaluate(function (text) {
    // This JS is evaluated in the context of the webpage and has jQuery
    // available
    $('#text').html(text);
    return {
      width: $('#container').width(),
      height: $('#container').height()
    };
  }, khmer);

  page.clipRect = {
    top: 0,
    left: 0,
    width: dimensions.width,
    height: dimensions.height
  };

  page.render(outputPath);
  phantom.exit();
});
