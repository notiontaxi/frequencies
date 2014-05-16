/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/test/Test',
  'js/MusicPlayer',
  'js/GUI'
  ], function(
    Test,
    MusicPlayer,
    GUI 
  ) {

var Frequencies, _ref, module,


  module = function() {}
  Frequencies = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Frequencies(containerIdentifier){   

      this.gui = new GUI(containerIdentifier)
      this.musikPlayer = new MusicPlayer()

      this.initialize()
      //this.runTests()
    }

    Frequencies.prototype.initialize = function(){
      // var test = new Test()
    }


    Frequencies.prototype.runTests = function(){
      // var test = new Test()
    }


// --------------------------------------
    return Frequencies
  })()
  return module.exports = Frequencies
})