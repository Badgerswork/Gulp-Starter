Gulp-Starter
==============

#### A starting place for Gulp Based Build System

A Gulp based build system for compiling SASS, JS serving using BrowserSync

*Instructions:*

+ Copy files of Gulp Starter into project route
+ Open a command line and navigate to the route of the project
+ Type  npm install

There are several commands that can be run depending on what you wish to achieve:

+    gulp watch
+    gulp sassLint
+    gulp scripts
  
  
These can also be run with the following flags

  --debug
  --dist
  

The gulp watch task will compile the SASS & scripts, serve up the project using BrowserSync then watch and recompile the SASS & JS when you save any changes. 
Running the commands with the --dist (eg. gulp scripts --dist ) flag compresses, minifies & removes any sourcemaps and renames to .min.css or .min.js for the outputed files.
The --debug flag runs the tasks but enabled many debug statements to be output to the console to help with any debugging
  


