var elopts = (function() {
  
  // deeply extend an object with the properties another one
  // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
  function deepExtend(destination, source) {
    for (var property in source) {
      if (source[property] && source[property].constructor &&
       source[property].constructor === Object) {
        destination[property] = destination[property] || {};
        arguments.callee(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  }
  
  // converts a string to camelcase
  // http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
  function camelize(string) {
    return string[0].toLowerCase() + string.replace(/-([a-z])/g, function(a, b) {
        return b.toUpperCase();
    }).slice(1);
  };
  
  // parse query parameters from a string
  // adopted from: http://stackoverflow.com/questions/18022683/how-to-access-request-query-string-parameters-in-javascript
  // TODO: recursively parse query object syntax: object[key]=value etc.
  function queryParams(url) {
    var result = {};
    var pairs = url.split(/[\?&]+/);
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      result[pair[0]] = pair[1];
    }
    return result;
  }
  
  // convert data-attributes to javascript object
  function dataset(element) {
    var result = {};
    if (element.attributes) {
      for (var i = 0, attrNode; attrNode = element.attributes[i]; i++) {
        if (attrNode.name.substring(0, 5) == "data-") {
          result[camelize(attrNode.name.substring(5))] = attrNode.value;
        }
      }
    }
    return result;
  };
  
  // iterate recursively through object and try to convert string values to json.
  function deepJson(object) {
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
          value = JSON.parse(value);
          if (isArray && value.result) {
            value = value.result;
          }
        } catch (e) {
          // invalid json
        }
      } else if (typeof value === "object" && !(value instanceof Array)) {
        // recursive
        value = deepJson(value);
      }
      
      result[key] = value;
    }
    
    return result;
  }
  
  // parses a data-section containing json from an element
  function cdataJson( element ) {
    var string = element.textContent.replace(/^\s*<\!\[CDATA\[/m, "").replace(/\]\]>\s*$/m, "");
    var json = null;
    if (string) {
      try {
        json = JSON.parse(string);
      } catch (e) {
        throw('Invalid json in cdata-section');
      }
    }
    return json;
  };
  
  
  /**
   * ElementOptions
   * 
   * Collect parameters from a dom-element
   */
  
  function ElementOptions(options) {
    
    this.options = {};
    deepExtend(this.options, ElementOptions.prototype.options);
    deepExtend(this.options, options);
    
    function getOptions(object) {
      
      result = {};
      
      if (object.nodeType == 1) {
        // dom-element
        
        var src = object.getAttribute('src');
        
        if (this.options.params && src != null) {
          // parse query params from src-attribute
          result = deepExtend(result, queryParams(src));
        }
        
        if (this.options.dataset) {
          // resolve dataset
          result = deepExtend(result, dataset(object));
        }
        
        if (this.options.cdata) {
          // cdata-json
          result[this.options.cdataName] = result[this.options.cdataName] || cdataJson(object);
        }
        
      } else if (typeof object == 'object' && !object.nodeType) {
        // merge object into result
        result = deepExtend(result, object);
      }
      
      if (this.options.json) {
        // parse json values
        result = deepJson(result);
      }
      
      return result;
      
    }
    
    this.get = function(objects /* ... */) {
      
      var result = {};
      
      for (var i = arguments.length - 1; i >= 0; i--) {
        var arg = arguments[i];
        var opts = getOptions.call(this, arg);
        result = deepExtend(result, opts);
      }
      
      return result;
    };
    
  }
  
  ElementOptions.prototype.options = {
    json: true, 
    dataset: true, 
    cdata: true, 
    cdataName: 'data', 
    params: true
  };
  
  // helper plugin
  function newInstance(options) {
    var func = function elopts(/* ... */) {
      var elementOptions = new ElementOptions(arguments.callee.options);
      return elementOptions.get.apply(elementOptions, arguments);
    };
    func.options = options;
    func.newInstance = arguments.callee;
    return func;
  }
  
  try {
    define(function() {
      return newInstance();
    });
  } catch (e) {}
  
  return newInstance();
  
})();