define(['jquery', 'mejs'], function($, mejs) {
  
  // you may use $ in here
  function App(element, options) {
    // init app
    //
    var mediaelement = document.createElement('video');
   
    var source = document.createElement('source');
    if (options.type) {
      // for hls: 'application/x-mpegURL' 
      source.setAttribute('type', options.type);
    }
    
    source.setAttribute('src', options.src);
    
    mediaelement.appendChild(source);
    
    $(element).append(mediaelement);
    
    var player1 = new mejs.MediaElementPlayer(mediaelement, options);
    
  }
  
  return App;
  
});