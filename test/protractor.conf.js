exports.config = {
  baseUrl: 'http://localhost:8080',

  // Load Selenium
  // *************

  // Although loading selenium from the jar file each time is slower, it makes
  // it easier for new folks to get started testing our codebase.
  seleniumServerJar: './test/lib/selenium/selenium-server-standalone-2.37.0.jar',

  // specify this if you want to connect to an existing selenium server rather
  // than loading the jar file each time
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  // The port to start the selenium server on, or null if the server should
  // find its own unused port.
  seleniumPort: null,

  // Setup Chromedriver 
  // ******************

  // Chromedriver location is used to help the selenium standalone server
  // find chromedriver. This will be passed to the selenium jar as
  // the system property webdriver.chrome.driver. If null, selenium will
  // attempt to find chromedriver using PATH.

  // mac version:
  chromeDriver: './test/lib/selenium/drivers/mac/chromedriver',

  // linux version:
  // chromeDriver: './test/lib/selenium/drivers/linux/chromedriver',

  // windows ???


  // Additional command line options to pass to selenium. For example,
  // if you need to change the browser timeout, use
  // seleniumArgs: ['-browserTimeout=60'],
  seleniumArgs: [],


  specs: ['e2e/*.js'],

  capabilities: {
    // 'browserName': 'firefox'
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    // onComplete: some function to call
    defaultTimeoutInterval: 10000 // defaults to 5000 mS
  }
};
