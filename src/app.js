define(['jquery', 'mejs'], function($, mejs) {
  
  // you may use $ in here
  function App(element, options) {
    // init app
    
    console.log("INIT MEDIA ELEMENT: ", mejs);
    //
    var mediaelement = document.createElement('video');
    $(mediaelement).attr('id', 'player');
    
    var source = document.createElement('source');
    if (options.type) {
      // for hls: 'application/x-mpegURL' 
      source.setAttribute('type', options.type);
    }

    mediaelement.setAttribute('src', options.src);
    
    mediaelement.appendChild(source);
    
    $(element).append(mediaelement);
    
    options.src = undefined;
    delete options.src;
    
    var player1 = new mejs.MediaElementPlayer(mediaelement, options);
    
  }
  
  return App;
  
});