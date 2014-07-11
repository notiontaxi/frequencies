/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effects.html',
    'assets/js/EffectWave.js',
    'assets/js/EffectMicrophone.js',
  ], function(
      effectsTemplate,
      EffectWave,
      EffectMicrophone
  ) {

var Effects, _ref, module,


  module = function() {}
  Effects = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------

    function Effects(musicplayer){   

      this.musicplayer = musicplayer
      this.active = true

      this.container = $("#panel-right .content").append($(effectsTemplate))
      this.initialize()

    }

    Effects.prototype.initialize = function(){
      this.effectWave = new EffectWave(this.musicplayer)
      this.effectMicrophone = new EffectMicrophone(this.musicplayer)
    }

    Effects.prototype.activity = function() {
      return this.active;
    }



// --------------------------------------
    return Effects
  })()
  return module.exports = Effects
})