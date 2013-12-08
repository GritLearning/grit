var exec = require("cordova/exec");
module.exports = {
    set: function ScreenOrientation(str, success, fail) {
        exec(success, fail, "ScreenOrientation", "set", [str]);
    }
};
