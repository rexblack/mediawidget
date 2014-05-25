require.config(
  {
    paths: {
      'initscript': 'lib/requirejs-initscript/build/initscript'
    }
  }
);

require(['initscript!'], function(initscript) {
  
  console.info("initscript: ", initscript);
  
  // insert a pseudo-widget before script-element
  var element = document.createElement('div');
  element.style.border = "1px solid #CCCCCC";
  element.style.padding = "5px";
  element.style.margin = "8px 0";
  element.innerHTML = "Widget [value: " + initscript.getAttribute('data-value') + "]";
  
  initscript.parentNode.insertBefore(element, initscript);
  
});

