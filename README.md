Gulp-Starter
==============

#### A starting place for Gulp Based Build System

A Gulp based build system for compiling SASS, JS serving using BrowserSync, minification of images, inlining of critical path css & collation of all assets in to dist folder

*Instructions:*

+ Copy files of Gulp Starter into project route
+ Open a command line and navigate to the route of the project
+ Type  npm install

There are several commands that can be run depending on what you wish to achieve:

+    gulp watch
+    gulp dist
+    gulp criticalPath
  
  
These can also be run with the following flags
  --dev
  --debug
  --dist
  

The gulp watch task will compile the SASS & scripts, serve up the project using BrowserSync then watch and recompile the SASS & JS when you save any changes. 
Running the commands with the --dist (eg. gulp scripts --dist ) flag compresses, minifies & removes any sourcemaps and renames to .min.css or .min.js for the outputed files.
The --debug flag runs the tasks but enabled many debug statements to be output to the console to help with any debugging
  

File structure required: 

/styles - all sass files
/js - all js files
/images - all image files
/fonts - font files
/dist - output directory for publication

All of these are configurable in the gulp > settings > paths.js file
