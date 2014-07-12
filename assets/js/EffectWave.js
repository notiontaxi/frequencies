/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-sinus.html',
    'assets/js/Effect.js',
  ], function(
      effectTemplate,
      Effect
  ) {

var EffectWave, _ref, module,


  module = function() {}
  EffectWave = (function(_super){
    __extends(EffectWave, Effect);
// --------------------------------------


    function EffectWave(musicplayer){   

      this.musicplayer = musicplayer

      this.container = $(Effect.CONTAINER).append($(effectTemplate))
      this.initialize()
      this.mute(true)
    }


    EffectWave.prototype.initView = function(){
      var that = this
      $("#wave-effect-slider").on("input change", function(event){
          if(!that.muted){
            that.updateFrequency(parseInt(event.target.value))
          }
        }
      )

      $("#wave-effect-toggle").on("change", function(event){
        that.mute(!event.target.checked)
        that.updateOutput()
        }
      )

      $('input[name="wave"]').change(function(){
        that.switchTypeTo(this.value)
      })           
    }

    EffectWave.prototype.updateOutput = function(){
      $("#wave-effect-slider-output").html(parseInt($("#wave-effect-slider")[0].value)+" hz") 
    }

    EffectWave.prototype.initEffect = function(){

      this.sineWave = this.musicplayer.getContext().createOscillator()
      this.sineWave.frequency.value = 400

      // this.sineWave.connect(this.musicplayer.getContext().destination)
      this.sineWave.connect(this.musicplayer.getAnalizer())

      this.gainNode = this.musicplayer.addGainNode("effect-sinus")

      this.sineWave.connect(this.gainNode)

      this.gainNode.connect(this.musicplayer.getContext().destination)
      this.sineWave.noteOn(0)
    }    

    EffectWave.prototype.updateFrequency = function(frequency){
      this.sineWave.frequency.value = frequency
      this.updateOutput()
    }   

    EffectWave.prototype.switchTypeTo = function(type){
      this.sineWave.type = parseInt(type)
    }

    EffectWave.prototype.mute = function(mute){
      if(mute){
        this.gainNode.gain.value = -1
        this.sineWave.frequency.value = 24000
        this.gainNode.disconnect(this.musicplayer.getContext().destination)
        this.sineWave.disconnect(this.gainNode)
        this.sineWave.disconnect(this.musicplayer.getAnalizer())
      }else{
        this.gainNode.gain.value = 1
        this.sineWave.frequency.value = $("#wave-effect-slider")[0].value          
        this.sineWave.connect(this.musicplayer.getAnalizer())
        this.sineWave.connect(this.gainNode)
        this.gainNode.connect(this.musicplayer.getContext().destination)
      }    
      this.muted = mute
    }


// --------------------------------------
    return EffectWave
  })()
  return module.exports = EffectWave
})