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

## Setup http-server

`http-server` is a simple HTTP server (surprise!) that is installed as an NPM module in this repository. To invoke it do
```
cd /path/to/grit
./node-modules/.bin/http-server .
```

Alternatively you can install `http-server` package globally (via `npm install -g http-server`) - then just do 
```
cd /path/to/grit
http-server .
```
The advantage of installing it globally is that you can use it on other projects too.


## Setup Tests 
```
npm install -g karma 
cd /path/to/this/app
karma start
```

### Optional bower setup
Bower(http://bower.io/) is a package manager similar to npm but more focused on front-end web development thatn `npm`. We use bower to manage most of our front-end dependencies (angular, jquery etc.). You don't need to worry about bower unless you want to upgrade these dependencies. 

## Setup Android

To get the Android build going checkout ``grit-android`` and link the
main grit repository into ``assets/www``


## Pre-release checklist

Before sending the final release to the store we should check:

- [ ] All image assets have been run through Imageoptim (http://imageoptim.com/) or similar
- [ ] `assets/www` contains only the files required for the app - all dev files and spec files should be removed to keep the .apk small
- [ ] `index.html` is loading the concatenated & minified Javascript file(s). At the very least we should be using minified versions of the `js/libs` files.
- [ ] document exactly what setup setups are required after somebody installs the app
