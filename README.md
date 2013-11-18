# grit

[![Code Climate](https://codeclimate.com/github/GritLearning/grit.png)](https://codeclimate.com/github/GritLearning/grit)

To find out more about `grit` feel free to join our mailing list here: https://groups.google.com/forum/#!forum/grit-learning

## Prerequesites

Before you install grit you need to:

1. Install the android developer tools
    * There are quite a few steps in this but good information available at http://developer.android.com/index.html 
    * We **strongly recommend** going through the process of setting up your Android tools (and hooking up your android device if you have one) using a **very simple** native android project. If you have not done it before, there are quite a few things to learn in that workflow and using a simple native app will mean that the questions you ask on Stack Overflow are much more likely to get answered because they have more in common with how other Android devs started.
2. Install node.js (version 0.10.0 or greater)
    * You can install node using one of:
        * All platforms: download it from http://nodejs.org
        * Mac OS X only: Using homebrew e.g. `brew install node`
        * Linux only: Using your package manager. Don't forget to check what version of Node your package manager will give you. Some update infrequently so the version of node they offer can be very old. This will cause you problems later on.

    If you are unsure which option is best or are unfamiliar with package management on your platform, you should use http://nodejs.org
3. Setup grunt
    * Grunt is a Javascript build tool (like make, rake, ant in other languages)
        * Install `grunt-cli` globally by running `npm install -g grunt-cli` (full instructions here: http://gruntjs.com/getting-started) 
        * All the node modules required by grunt are already part of the repo (in the `node_modules` dir) so you shouldn't need anything else.
        * Run `grunt --help` and check that it runs without error. Also it's output tells you what tasks are available.
4. Setup http-server
    * Run `npm install -g http-server` to install a minimal http-server that you can invoke from the command line. We will use this web server to serve files from `grit` to our browser for debugging etc. 
    * Run `http-server --help` to see a summary of it's options.

5. Setup bower (optional)
    * Bower(http://bower.io/) is a package manager similar to npm but more focused on front-end web development than `npm`. 
    * We use bower to manage most of our front-end dependencies (angular, jquery etc.). - see the `bower_components` directory in the `grit` repository.
    * You don't need to worry about bower unless you want to upgrade these dependencies. 
    * You can install bower by following the instructions at  http://bower.io

## Building git for deploying to a device
Grit is currently split across three git repositories so building it is a tad involved at the moment (sorry!). It is best explained by an example:

Let us say that you keep source code on your machine in `/home/code`. You would do the following

1. Clone the `grit-android` repository into a directory in `/home/code` e.g.
    ```

    cd /home/code
    git clone https://github.com/GritLearning/grit-android
    ```
2. Next, clone the `grit` repository . You can put it anywhere but in this example we are going to put it into `/home/code`:
    ```

    cd /home/code/
    git clone https://github.com/GritLearning/grit
    ```
3. Finally, clone the `grit-khmer` repository into a directory called `content` within the `grit` repository e.g.
    ```

    cd /home/code/grit
    git clone https://github.com/GritLearning/grit-khmer content
    ```
    4. Apache cordova will expect the web files to be in the `assets/www` directory within the android project. Create that directory if it does not already exist
    ```

    mkdir /home/code/grit-android/assets/www
    ```
5. Build grit using grunt.
    Now we need to build grit into the `grit-android/assets/www` directory so we run grunt with a command line arg to tell it where to put the files.
    ```

    cd /home/code/grit
    grunt --build-dir=/home/code/grit-android/assets/www
    ```
6. Grit should be ready to deploy to your device now.

## Building grit for your browser 
1. Build grit for the browser.
    IF we run grunt without any arguments, it will build grit into the `./www` directory in the repository.
    ```

    cd /path/to/grit
    grunt
    ```
2. In a separate terminal window, start a HTTP server to serve the files to the browser
    ```

    cd /path/to/grit
    http-server ./www
    # http-server will output some text here including the URL it is listening on
    ```
3. Go to the URL that the server is listenting on in your browser e.g. `http://localhost:8080`. You should now see the grit web app and be able to debug it as you would any other web app.

## Use grunt watch to save time

To save yourself from having to run grunt every time you change a file, you can run `grunt watch` which will notice file changes and re-run the build. From your terminal window, run `grunt watch` from the project directory.
    ```

    cd /path/to/grit
    grunt watch
    ```
Now when you edit grit files. `grunt watch` will notice those changes and re-build the project into the `./www` directory by default

## Command line options for grunt

You can pass some command line arguments to `grunt` to customise how it builds the project. For example:
```
grunt --env=development --platform=android --build-dir=./www 
# these are the defaults options but you can override them. For example, to
# build the project into a different directory (e.g. the assets directory of the
# android project) you could do something like:
grunt --env=development --platform=android --build-dir=../grit-android/assets/www
```

Have a look at `Gruntfile.js` for the full list of options and their meanings.  
