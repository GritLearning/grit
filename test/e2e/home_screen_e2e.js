/* globals describe, it, expect, protractor, beforeEach */
'use strict';

describe('home screen', function () {
  var ptor;

  beforeEach(function () {
    // Navigate the browser back to the homepage between each test
    ptor = protractor.getInstance();
    ptor.get('http://localhost:8080/');
  });

  it('opens an alert box when you click on the first link', function () {
    ptor = protractor.getInstance();
    ptor.findElement(protractor.By.className('link')).click();
    // expect(ptor.getCurrentUrl()).toContain('#/');
    var alertDialog = ptor.switchTo().alert();
    expect(alertDialog.getText()).toMatch(/If cordova existed I would open/);
    alertDialog.accept();
  }, 10000); // set 10 sec timeout on this test
});
