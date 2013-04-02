package com.GritLearning.plugin;

import java.util.List;

import org.apache.cordova.api.CordovaPlugin;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.widget.Toast;


public class GritLauncher extends CordovaPlugin {

	private void  launchComponent(String packageName, String name){
	    Intent launch_intent = new Intent("android.intent.action.MAIN");
	    Activity activity = new Activity();
	    launch_intent.addCategory("android.intent.category.LAUNCHER");
	    launch_intent.setComponent(new ComponentName(packageName, name));
	    launch_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

	    activity.startActivity(launch_intent);
	}

	public void startApplication(String application_name){
	    try{
	        Intent intent = new Intent("android.intent.action.MAIN");
		    Activity activity = new Activity();
	        intent.addCategory("android.intent.category.LAUNCHER");

	        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
	        List<ResolveInfo> resolveinfo_list = activity.getPackageManager().queryIntentActivities(intent, 0);

	        for(ResolveInfo info:resolveinfo_list){
	            if(info.activityInfo.packageName.equalsIgnoreCase(application_name)){
	                launchComponent(info.activityInfo.packageName, info.activityInfo.name);
	                break;
	            }
	        }
	    }
	    catch (ActivityNotFoundException e) {
		    Activity activity = new Activity();
	        Toast.makeText(activity.getApplicationContext(), "There was a problem loading the application: "+application_name,Toast.LENGTH_SHORT).show();
	    }
	}
}
