/* globals describe, it, expect, protractor, beforeEach */

// describe('angularjs homepage', function() {
//   'use strict';
// 
//   it('should greet the named user', function() {
//     browser.get('http://www.angularjs.org');
// 
//     element(by.model('yourName')).sendKeys('Julie');
// 
//     var greeting = element(by.binding('yourName'));
// 
//     expect(greeting.getText()).toEqual('Hello Julie!');
//   });
// });

describe('Some stuff', function () {
  'use strict';
  var ptor;

  beforeEach(function () {
    // Navigate the browser back to the homepage between each test
    ptor = protractor.getInstance();
    ptor.get('#/');
  });

  it('does stuff', function () {
    ptor = protractor.getInstance();
    ptor.findElement(protractor.By.className('link')).click();
    expect(ptor.getCurrentUrl()).toContain('#/quiz');
  }, 10000);
});
