'use strict';
/* global console */

var cordovaApp = {

  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onBackButtonPress: function (event) {
    event.preventDefault(); // disable the back button
  },

  onDeviceReady: function () {
    // FYI in here, 'this' is the event object, not the cordovaApp object

    // Currently this code doesn't do anything because Angular knows how to
    // bootstrap itself and it appears to work fine under cordova. We can
    // manually boot angular like this:
    //angular.element(document).ready(function() {
    //    angular.bootstrap(document);
    //});

    console.log('running deviceready event handler');
    // Note: for some reason, passing the function as this.onBackButtonPress does not work here
    document.addEventListener('backbutton', cordovaApp.onBackButtonPress, false);
    // List of events: http://docs.phonegap.com/en/2.9.0/cordova_events_events.md.html
  }
};

cordovaApp.initialize();
