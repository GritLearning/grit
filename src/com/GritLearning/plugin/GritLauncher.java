package com.GritLearning.plugin;


import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.LOG;

public class GritLauncher extends CordovaPlugin {

	private static String TAG = "GritLauncher";
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        LOG.d(TAG, "starting out");
		try {
			if (action.equals("startActivity")) {

				String name = args.getString(0);
	            LOG.d(TAG, "got: " + name);

	            Intent i = new Intent();
	            Activity ctx = cordova.getActivity();
	            PackageManager manager = ctx.getPackageManager();
	            //PackageManager manager = getPackageManager();
	            i = manager.getLaunchIntentForPackage(name);
	            LOG.d(TAG, "intent: " + i.toString());
	            i.addCategory(Intent.CATEGORY_LAUNCHER);
	            LOG.d(TAG, "intent: " + i.toString());
	            cordova.startActivityForResult(this,i, 1);
	            LOG.d(TAG, "made it through the start");

				return true;
			}
			return false;
		} catch (JSONException e) {
			LOG.d(TAG, "died");
			e.printStackTrace();
			return false;
		}
	}
}
