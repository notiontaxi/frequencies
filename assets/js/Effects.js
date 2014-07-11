/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effects.html',
    'assets/js/EffectSinus.js',
  ], function(
      effectsTemplate,
      EffectSinus
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

    }

    Effects.prototype.initialize = function(){
      this.effectSinus = new EffectSinus(this.musicplayer)
    }



// --------------------------------------
    return Effects
  })()
  return module.exports = Effects
})