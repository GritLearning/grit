//wait for cordova to load
window.addEventListener("load",function(){
    document.addEventListener("deviceready",phonegapReady,false)
});


function phonegapReady(){

    //once cordova has loaded
    var screenOrientation = function() {}
    screenOrientation.prototype.set = function(str, success, fail) {
        cordova.exec(null, null, "ScreenOrientation", "set", [str]);
    };
    window.screenOrientation = new screenOrientation();

    //To change screen orientation use
    window.screenOrientation.set("landscape");
};
