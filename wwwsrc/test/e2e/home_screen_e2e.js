'use strict';

describe('home screen', function () {
  var ptor;

  beforeEach(function () {
    // given ...
    ptor = protractor.getInstance();
    ptor.get('/#');
  });

  it('opens an alert box when you click on the first link', function () {
    // when ...
    ptor = protractor.getInstance();
    ptor.findElement(protractor.By.className('link')).click();

    // then ...
    var alertDialog = ptor.switchTo().alert();
    expect(alertDialog.getText()).toMatch(/If cordova existed I would open/);
    alertDialog.accept();
  });
});
