/*
Initialization of the image processing functionalities

Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'text!templates/effect-list.html',
  'text!templates/music-player.html',
  'text!templates/playlist.html',
  'text!templates/visualization-background.html',  
  'js/test/Test',
  ], function(
  effectList,
  musicPlayer,
  playlist,
  visualization,
  Test 
  ) {

var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function MusicPlayer(containerIdentifier){   

      // render templates
      $(containerIdentifier).append($(effectList))
      $(containerIdentifier).append($(playlist))
      $(containerIdentifier).append($(visualization))
      $(containerIdentifier).append($(musicPlayer))
      
      this.initialize()
      //this.runTests()
    }

    MusicPlayer.prototype.initialize = function(){
      $('.action-toggle-panel').click(
          function(){
            var refId = "#"+($(this).attr( "refer" ))
            $(refId).toggleClass("slide-out")
          }
        )
    }

    MusicPlayer.prototype.runTests = function(){
      var test = new Test()
    
    }


// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})