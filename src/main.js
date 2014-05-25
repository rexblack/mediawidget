(function() {
  
  /*
   * <%g= string(pkg.name).humanize() %>
   * <%g= pkg.version %>
   */
  
  require.config(
    {
      baseUrl: '.', 
      paths: {
        initscript: 'lib/requirejs-initscript/build/initscript', 
        css: 'lib/require-css/css', 
        normalize: 'lib/require-css/normalize',
        'css-builder': 'lib/require-css/css-builder', 
        domReady: 'lib/requirejs-domready/domReady', 
        elopts: 'lib/elopts/build/elopts', 
        jquery: 'lib/jquery/dist/jquery'
      }, 
      config: {
        initscript: {
          // filename of executing requirejs-bundle
          name: "<%g= bundle_name %>"
        }
      }
    }
  );
  
  // need to wrap initscript into a static require call to get it work with optimizer namespace option
  require(['require', 'elopts', 'app', 'initscript'], function(require, elopts, App) {
    
    // cache-bust the src to make it call every time the script executes
    require(['initscript!' + new Date().getTime() + Math.random() * 10000000000000000], function(initscript) {
      
      // bootstrap app
      var options = elopts(initscript);
      var element = document.createElement('div');
      element.className = "<%g= css_name %>";
      initscript.parentNode.insertBefore(element, initscript);
      var app = new App(element, options);
      
    });
  
  });
  
  
  
  
})();