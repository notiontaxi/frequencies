/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/Playlist',
  'js/Effects',
  'js/Visualization'
  ], function(
    Playlist,
    Effects,
    Visualization
  ) {

var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function MusicPlayer(){   

      this.playlist = new Playlist(this)
      this.effects = new Effects(this)
      this.visualization = new Visualization(this)
      
      this.initialize()
      //this.runTests()
    }

    MusicPlayer.prototype.initialize = function(){

    }



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})