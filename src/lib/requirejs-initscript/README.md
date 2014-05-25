requirejs-initscript
====================

A requirejs-plugin to find the main executing script element.

Case
----
When building a reuseable widget-application with requirejs, you may need to access the embedding script element to gather certain parameters, such as data-attributes, CDATA-/JSON-content or the url's querystring.


Usage
-----

Require the initscript-plugin from your main-file and only once in an application. Catch information as needed and delegate to your app instance.
Since the plugin works by finding the script-element via its src-attribute, the filename of the executing script needs to be predictable. 

### Regular and single builds
To non-builds and loose single or project builds applies that our requirejs-application is only executed once in a document. 
That means, that we're done by finding our script-element by its source. 
In this case, the plugin reads out its first dependency which holds the name of the executing file. 
```
// main.js
require.config(
  {
    paths: {
      'initscript': 'lib/requirejs-initscript/build/initscript'
    }
  }
);
require(['initscript!'], function(initscript) {
  // init app
}
```

```
<script src="http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js" data-main="main.js" data-value="static_1"></script>
```
As data-main-source either use your main.js or your single build output file. 


### Bundle build
In order to make our widget-application run in other requirejs-environments we need requirejs itself namespaced and bundled with the application script as described here: 
http://requirejs.org/docs/faq-advanced.html#rename

```
// example optimizer build config:
{
  optimize: "none",
  appDir: 'samples/bundle/src',  
  baseUrl: ".",
  mainConfigFile: "samples/bundle/src/main.js",
  findNestedDependencies: true, 
  dir: "samples/bundle/build", 
  namespace: 'initscriptExample', 
  paths: {
      requireLib: 'lib/requirejs/require'
  },
  modules: [
      {
          name: "bundle",
          include: ["requireLib", "main"],
          //True tells the optimizer it is OK to create
          //a new file foo.js. Normally the optimizer
          //wants foo.js to exist in the source directory.
          create: true
      }
  ]
}
```

When using a bundle build, your requirejs-application can also be executed multiple times.  
In this case, we need a dynamic require with a cache-busting id on the initscript-plugin in order to make the plugin run any time the script gets executed.

Since we cannot ressolve any dependency filenames in a bundled build, the name of the output-file needs to be configured.
Also optimizer throws an error on dynamic require-calls at the first level, so we workaround this by wrapping it in a static call referencing local-require.

```
// src/main.js
require.config(
  {
    paths: {
      'initscript': 'lib/requirejs-initscript/build/initscript'
    }, 
    config: {
      initscript: {
        // filename of executing requirejs-bundle
        name: 'bundle' 
      }
    } 
  }
);
// need to wrap it into a static require call to get it work with optimizer namespace option.
// also add a static reference to the initscript-plugin in order to be included in optimized build.
require(['require', 'initscript'], function(require) {
  // cache-bust the src to make it call every time the script executes
  require(['initscript!' + new Date().getTime()], function(initscript) {
    // init app
  });
});
```
```
<script src="bundle.js" data-value="static_1"></script>
```




