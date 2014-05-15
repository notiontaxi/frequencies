/*
Initialization of the image processing functionalities

Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'text!templates/music-player.html',  
  'js/test/Test',
  ], function(
  contentTemplate, 
  Test 
  ) {

var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------



    function MusicPlayer(containerIdentifier){   

      // render templates
      $(containerIdentifier).html($(contentTemplate))
      
      this.initialize()
      //this.runTests()
    }


    MusicPlayer.prototype.initialize = function(){
      
    }    

    MusicPlayer.prototype.runTests = function(){
      var test = new Test()
    
    }

   



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})