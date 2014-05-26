(function () {

  function elementInDocument(element) {
    while (element = element.parentNode) {
        if (element == document) {
            return true;
        }
    }
    return false;
  };
  
  
  function cleanSrc(string) {
    if (string) {
      string = string.replace(/^(.\/)/, "");
      string = string.replace(/\/$/, '');
      var origin = (window.location.protocol + "\/\/" + window.location.host + window.location.pathname).replace(/\\/g, '/');
      if (origin.substring(origin.length - 1, 1) != "/") {
        var a = origin.split('/');
        a.pop();
        origin = a.join("/");
      }
      string = string.replace(new RegExp("\^\(" + origin + "\)", "ig"), '');
      string = string.split("?")[0];
    }
    return string;
  }

    //Main module definition.
  define(['require', 'module'], function(req, module) {
    
    // holds already initialized scripts
    var initialized = [];
  
    
    
    
    function matchScripts(name) {
      
      var matches = [];
      var scripts = document.getElementsByTagName('script');
      
      var baseUrl = cleanSrc(req.toUrl(''));
      var filename = baseUrl ? baseUrl + "/" + name + ".js" : name + ".js";
      
      for (var i = 0, script; script = scripts[i]; i++) {
        
        var match = null, src = null;
        
        src = cleanSrc(script.getAttribute('data-main'));
        
        if (filename == src) {
          match = script;
        }
        
        src = cleanSrc(script.getAttribute('src'));
        
        if (filename == src) {
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