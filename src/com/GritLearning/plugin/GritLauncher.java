package com.GritLearning.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;


public class GritLauncher extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("open")) {
            String target = args.getString(0);
            String name = args.getString(1);

            Intent i = new Intent();
            Activity activity = new Activity();
            PackageManager manager = this.ctx.getPackageManager();
            i = manager.getLaunchIntentForPackage(name);
            i.addCategory(Intent.CATEGORY_LAUNCHER);
            activity.startActivity(i);            return true;
        }
        return false;
    }
}
