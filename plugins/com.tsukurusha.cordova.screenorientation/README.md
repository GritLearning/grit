# Updated to use with Cordova 3.x

# Screen Orientation PhoneGap Plugin for Android

This PhoneGap Plugin for Android can lock/unlock the screen orientation.

## How to install

* install it via cordova cli: `cordova plugin add https://github.com/gitawego/pg-plugin-screen-orientation.git`

* Add the following line to www/config.xml.
```
<gap:plugin name="com.tsukurusha.cordova.screenorientation" />
```

* The javascript interface is as follows:

 - To lock the screen to Landscape: `navigator.screenOrientation.set('landscape');`

 - To lock the screen to Portrait:`navigator.screenOrientation.set('portrait');`

 - To unlock:`navigator.screenOrientation.set('fullSensor');`

 - You can use other orientation parameters defined in http://developer.android.com/reference/android/R.attr.html#screenOrientation
