define(['jquery', 'css!style/main.css'], function($) {
  
  // you may use $ in here
  function App(element, options) {
    // init app
    $(element).append("<div>" + options.hello + "</div>");
  }
  
  return App;
  
});