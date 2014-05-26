(function () {
  
  function elementOptions(element) {
    
    // checks if an object is a dom element
    function isDOMElement(object) {
      return typeof object == 'object' && object.nodeType == 1;
    }
    
    // convert data-attributes to javascript object
    function dataset(element) {
      var result = {};
      if (element.attributes) {
        for (var i = 0, attrNode; attrNode = element.attributes[i]; i++) {
          if (attrNode.name.substring(0, 5) == "data-") {
            result[Util.camelize(attrNode.name.substring(5))] = attrNode.value;
          }
        }
      }
      return result;
    };
    
    // iterate recursively through object and try to convert string values to json.
    function parseJSON(object) {
      var result = {};
      for (var key in object) {
        var value = object[key];
        if (typeof value == "string") {
          try {
            // convert single quotes
            value = value.replace(/'/g,"\"");
            // trim
            value = value.replace(/^\s+|\s+$/g, '');
            var isArray = false;
            if (value.substring(0, 1) == "[") {
              // array
              value = value.replace(/^\s*\[(.*)\]$/g, "{\"result\": [$1] }");
              isArray = true;
            }
            value = $.parseJSON(value);
            if (isArray && value.result) {
              value = value.result;
            }
          } catch (e) {
            // invalid json
          }
        } else if (typeof value == "object" && !isDomElement(object)) {
          // recursive
          value = jsonValues(value);
        }
        
        result[key] = value;
      }
      
      return result;
    }
    
    // returns the queryString from an url
    function getQueryString(queryString) {
      
    }
    
    // parses query parameters from an url
    function getQueryParams(queryString) {
      
    }
    
    // does all the logic
    function getOptions(element) {
      var result = dataset(element);
      result = parseJSON(result);
      
      return result;
    }
    
    
    return options; 
  }
  
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
  
    var baseUrl = req.toUrl('');
    
    function matchScripts(name) {
      
      var matches = [];
      var scripts = document.getElementsByTagName('script');
      
      var baseUrl = cleanSrc(baseUrl);
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
        
        var script = null;

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
                script = match;
                break;
              }
            }
          }
        }
        
        
        var result = null;
        if (script) {
          
          var options = elementOptions(script);
          
          var src = script.src;
          
          var result = {
            element: script, 
            options: options 
          };
        }
        
        initialized.push(result);
        
        onload(result);

      }
      
    };
    
  });
  
}());