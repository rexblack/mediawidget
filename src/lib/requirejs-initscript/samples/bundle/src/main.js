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

// need to wrap it into a static require call to get it work with optimizer namespace option
require(['require'], function(require) {
  
  // cache-bust the src to make it call every time the script executes
  require(['initscript!' + new Date().getTime()], function(initscript) {
    
    console.info("initscript: ", initscript);
    
    // insert a pseudo-widget before script-element
    
    var element = document.createElement('div');
    element.style.border = "1px solid #CCCCCC";
    element.style.padding = "5px";
    element.style.margin = "8px 0";
    element.innerHTML = "Widget [value: " + initscript.getAttribute('data-value') + "]";
    
    initscript.parentNode.insertBefore(element, initscript);
    
  });
  
});

