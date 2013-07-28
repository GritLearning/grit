var page = require('webpage').create();
page.content = '<html><body> ខេមរភាសា </html></body>';
page.clipRect = {top: 14, left: 3, width: 70, height: 15};
page.render('test.png');
phantom.exit();
