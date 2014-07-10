/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effects.html',
  ], function(
      effectsTemplate
  ) {

var Effects, _ref, module,


  module = function() {}
  Effects = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Effects(musicplayer){   

      this.musicplayer = musicplayer

      this.container = $("#panel-right .content").append($(effectsTemplate))
      this.initialize()
      //this.runTests()
    }

    Effects.prototype.initialize = function(){
      this.initializeMicrophone()
      this.initializeSinusWave()
    }

    Effects.prototype.activity = function(){
      return true;
    }

    Effects.prototype.initializeMicrophone = function(){

    }

    Effects.prototype.initializeSinusWave = function(){
      var that = this
      $("#sinus-slider").on("input change", function(event){
        that.musicplayer.updateFrequency(parseInt(event.target.value))
        $("#sinus-slider-output").html("Frequency: "+parseInt(event.target.value)+" hz")}
      ) 
    }        



// --------------------------------------
    return Effects
  })()
  return module.exports = Effects
})