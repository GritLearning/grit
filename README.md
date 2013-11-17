# grit

[![Code Climate](https://codeclimate.com/github/GritLearning/grit.png)](https://codeclimate.com/github/GritLearning/grit)

To find out more about `grit` feel free to join our mailing list here: https://groups.google.com/forum/#!forum/grit-learning

To get started with the Grit Learning app you need at least one content repository and the main ``grit`` code base. To compile a Android app out of it you also need the ``grit-android`` repository.

## Setup

```
git clone grit              # or checkout via GUI client
git clone grit-khmer        # or checkout via GUI client
cd grit                     # or open a terminal in the grit directory
ln -s ../grit-khmer content # this will not work on windows :-(
```

Setup node.js

* Install node.js either from http://nodejs.org or `brew install node` on mac. You must have at least verstion 0.8 installed - run `node -v` to check.

Setup grunt

* Install `grunt-cli` by running `npm install -g grunt-cli` (full instructions here: http://gruntjs.com/getting-started) 
* All the node modules required by grunt are already part of the repo (in the `node_modules` dir) so you shouldn't need anything else.
* Run `grunt --help` to check that everything installed correctly. The output of this command tells you what tasks are available.

Setup http-server

* Run `npm install -g http-server` to install a minimal http-server that you can invoke from the command line. Alternatively you can run the `web-server.js` script in the repo to achieve the same thing.

### Optional bower setup
Bower(http://bower.io/) is a package manager similar to npm but more focused on front-end web development thatn `npm`. We use bower to manage most of our front-end dependencies (angular, jquery etc.). You don't need to worry about bower unless you want to upgrade these dependencies. 

## Setup Android

To get the Android build going checkout ``grit-android`` and link the
main grit repository into ``assets/www``

## Development workflow

1. Run `grunt watch` from the project directory
    ```
    cd /path/to/grit
    grunt watch       # this starts the grunt watcher which will monitor the files in the project for
                      # changes and build them into the ./www directory
    ```
2. Work on the files. `grunt watch` will notice those changes and re-build the project into the `./www` directory by default

## Command line options for grunt

You can pass some command line arguments to `grunt` that tell it w
```
grunt --env=development --platform=android --build-dir=./www 
# these are the defaults options but you can override them. For example, to
# build the project into a different directory (e.g. the assets directory of the
# android project) you could do something like:
grunt --env=development --platform=android --build-dir=../grit-android/assets/www
```

Have a look at `Gruntfile.js` for the full list of options and their meanings.


## Pre-release checklist

Before sending the final release to the store we should check:

- [ ] All image assets have been run through Imageoptim (http://imageoptim.com/) or similar
- [ ] `assets/www` contains only the files required for the app - all dev files and spec files should be removed to keep the .apk small
- [ ] `index.html` is loading the concatenated & minified Javascript file(s). At the very least we should be using minified versions of the `js/libs` files.
- [ ] document exactly what setup setups are required after somebody installs the app
