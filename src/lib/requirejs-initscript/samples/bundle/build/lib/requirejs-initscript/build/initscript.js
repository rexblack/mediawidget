(function () {

  function elementInDocument(element) {
    while (element = element.parentNode) {
        if (element == document) {
            return true;
        }
    }
    return false;
  };

    //Main module definition.
  initscriptExample.define(['require', 'module'], function(req, module) {
    
    // holds already initialized scripts
    var initialized = [];
  
    var baseUrl = req.toUrl('');
    
    function matchScripts(name) {
      
      var matches = [];
      var scripts = document.getElementsByTagName('script');
      
      var filename = baseUrl + name + ".js";
      filename = filename.replace(/^(.\/)/, "");
      
      for (var i = 0, script; script = scripts[i]; i++) {
        
        var match = null;
        if (filename == script.getAttribute('data-main')) {
          match = script;
        } else if (filename == script.getAttribute('src')) {
          match = script;
        }
        
        if (match) {
          matches.push(match);
        }
        
      }
      
      return matches;
    }
   
    return {
      
      load: function (name, req, onload, config) {
        
        var result = null;

          
        if (!config.isBuild) {
          
          var baseUrl = req.toUrl('');
          
          name = config.deps && config.deps.length ? config.deps[0] : null;

          if (!name) {
            name = module.config().name;
          }
          
          if (name) {
            
            // remove removed nodes
            for (var i = 0, script; script = initialized[i]; i++) {
              if (!elementInDocument(script)) {
                initialized.splice(i);
                i--;
              }
            }
            
            // match current script
            var matches = matchScripts(name);
            for (var i = 0, match; match = matches[i]; i++) {
              if (!(!!~initialized.indexOf(match))) {
                result = match;
                break;
              }
            }
          }
        }
        
        initialized.push(result);
        onload(result);

      }
      
    };
    
  });
  
}());