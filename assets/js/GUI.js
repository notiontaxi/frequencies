/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/connection-view.html',
    'text!templates/effect-list.html',
    'text!templates/music-player.html',
    'text!templates/playlist.html',
    'text!templates/track-info.html',
    'text!templates/visualization-background.html', 
    'text!templates/visualization-selection.html',
    'text!templates/canvas.html',
  ], function(
    connectionView,
    effectList,
    musicPlayer,
    playlist,
    trackinfo,
    visualization,
    visuSelection,
    canvasContainer
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
      $(containerIdentifier).append($(trackinfo))
      $(containerIdentifier).append($(visuSelection))
      $(containerIdentifier).append($(canvasContainer))
      $(containerIdentifier).append($(connectionView))
      $("#connection-view").hide()
      $(".active-link").css({"opacity":"0.0"})
      
      this.initialize()
      
      if(window.isTouchDevice){
        this.smartphoneOptions()
      }
    }

    GUI.prototype.initialize = function(){
        $('.action-toggle-panel').click(
          function(){
            var refId = "#"+($(this).attr( "refer" ))
            $(refId).toggleClass("slide-out")
          }
        )
    }

    GUI.prototype.smartphoneOptions = function(){
      $("#effects-container").css({'max-height': '377px'})
    }


// --------------------------------------
    return GUI
  })()
  return module.exports = GUI
})