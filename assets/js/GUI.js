/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-list.html',
    'text!templates/music-player.html',
    'text!templates/playlist.html',
    'text!templates/visualization-background.html',  
  ], function(
    effectList,
    musicPlayer,
    playlist,
    visualization
  ) {

var GUI, _ref, module,


  module = function() {}
  GUI = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function GUI(containerIdentifier){   

      // render templates
      $(containerIdentifier).append($(effectList))
      $(containerIdentifier).append($(playlist))
      $(containerIdentifier).append($(visualization))
      $(containerIdentifier).append($(musicPlayer))
      
      this.initialize()
    }

    GUI.prototype.initialize = function(){
      $('.action-toggle-panel').click(
          function(){
            var refId = "#"+($(this).attr( "refer" ))
            $(refId).toggleClass("slide-out")
          }
        )
    }


// --------------------------------------
    return GUI
  })()
  return module.exports = GUI
})