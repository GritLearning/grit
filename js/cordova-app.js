var cordovaApp = {

  initialize: function () {
    this.bindEvents();
  },

  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("backbutton", this.onBackButtonPress, false);
    // List of events: http://docs.phonegap.com/en/2.9.0/cordova_events_events.md.html
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
  },

  onBackButtonPress: function (event) {
    // FYI in here, 'this' is the event object, not the cordovaApp object
    console.log('caught a back button press');
    event.preventDefault();
  }
}; 

cordovaApp.initialize();
