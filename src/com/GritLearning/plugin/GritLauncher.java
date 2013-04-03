package com.GritLearning.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;


public class GritLauncher extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("echo")) {
            String target = args.getString(0);
            String name = args.getString(1);

            this.launchComponent(target, name, callbackContext);
            return true;
        }
        return false;
    }

	private void  launchComponent(String packageName, String name, CallbackContext callbackContext){
		try{
		Intent launch_intent = new Intent("android.intent.action.MAIN");
	    Activity activity = new Activity();
	    launch_intent.addCategory("android.intent.category.LAUNCHER");
	    launch_intent.setComponent(new ComponentName(packageName, name));
	    launch_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	    	activity.startActivity(launch_intent);
	    	callbackContext.success();
	    } 
		catch(ActivityNotFoundException e){
			callbackContext.error("There was a problem loading the application: "+ name);	
	    
	    }
	}
}
