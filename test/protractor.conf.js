exports.config = {
  // baseUrl: 
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/*.js'],
  capabilities: {
    'browserName': 'firefox'
  },
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    // onComplete: some function to call
    defaultTimeoutInterval: 30000 // defaults to 5000 mS
  }
};
