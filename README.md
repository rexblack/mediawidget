mediawidget
=============

> A 3pjs-mediaplayer built upon [requirejs](http://requirejs.org) and [mediaelement.js](http://mediaelementjs.com/).

Based on [3pjs-skeleton](http://github.com/rexblack/3pjs-skeleton).

To provide hls-support, it is using a fork by mangui which integrates [hls-provider](https://github.com/mangui/HLSprovider).
This has been [forked](http://github.com/rexblack/mediaelement) to get flash-media-bridge globally namespaced. 


Build instructions
------------------

```cli
npm install
bower install
grunt
```

Usage
-----

```html
<script src="p.js" 
  data-src="http://www.streambox.fr/playlists/test_001/stream.m3u8" 
  data-type="application/x-mpegURL"></script>
```

Hosted
------

You find a hosted version here: http://3pjs.benignware.com/mediawidget/p.js
```html
<script src="http://3pjs.benignware.com/mediawidget/p.js" 
  data-src="http://www.streambox.fr/playlists/test_001/stream.m3u8" 
  data-type="application/x-mpegURL"></script>
```
Demo: http://3pjs.benignware.com/mediawidget

> Note that the hosted version is currently only for development purposes and could be removed at any time. 

