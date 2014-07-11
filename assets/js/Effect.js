/*
Florian Wokurka (2014)
https://github.com/frequencies

ABSTACT CLASS
*/

"use strict"

define([

  ], function(
      
  ) {

var Effect, _ref, module,


  module = function() {}
  Effect = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------

    Effect.CONTAINER = "#effects-container";

    function Effect(musicplayer){   
      this.muted = true
      this.musicplayer = musicplayer
    }

    Effect.prototype.initialize = function(){
      this.initEffect()
      this.initView()
    }

    Effect.prototype.activity = function(){
      return true;
    }

    Effect.prototype.mute = function(mute){
      if(mute){
        this.gainNode.gain.value = -1
      }else{
        this.gainNode.gain.value = 1
      }
    }   

    Effect.prototype.initView = function(){
      // implement this in child class
    }

    Effect.prototype.initEffect = function(){
      // implement this in child class
    }       



// --------------------------------------
    return Effect
  })()
  return module.exports = Effect
})