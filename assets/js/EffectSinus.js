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

var EffectSinus, _ref, module,


  module = function() {}
  EffectSinus = (function(_super){
    __extends(EffectSinus, Effect);
// --------------------------------------


    function EffectSinus(musicplayer){   

      this.musicplayer = musicplayer

      this.container = $(Effect.CONTAINER).append($(effectTemplate))
      this.initialize()
      this.mute(true)
    }


    EffectSinus.prototype.initView = function(){
      var that = this
      $("#sinus-slider").on("input change", function(event){
          if(!that.muted){
            that.updateFrequency(parseInt(event.target.value))
          }
        }
      )

      $("#sinus-wave-toggle").on("change", function(event){
        that.mute(!event.target.checked)
        that.updateOutput()
        }
      )     

      $("#sinus-slider-output").html("Frequency: "+parseInt($("#sinus-slider")[0].value)+" hz") 
    }

    EffectSinus.prototype.updateOutput = function(){
      $("#sinus-slider-output").html("Frequency: "+parseInt($("#sinus-slider")[0].value)+" hz") 
    }

    EffectSinus.prototype.initEffect = function(){

      this.sineWave = this.musicplayer.getContext().createOscillator()

      this.sineWave.frequency.value = 1000

      this.sineWave.connect(this.musicplayer.getContext().destination)
      this.sineWave.connect(this.musicplayer.getAnalizer())

      this.gainNode = this.musicplayer.addGainNode("effect-sinus")

      this.sineWave.connect(this.gainNode)

      this.gainNode.connect(this.musicplayer.getContext().destination)
      this.sineWave.noteOn(0)
    }    

    EffectSinus.prototype.updateFrequency = function(frequency){
      this.sineWave.frequency.value = frequency
      this.updateOutput()
    }   

    EffectSinus.prototype.mute = function(mute){
      if(mute){
        this.gainNode.gain.value = -1
        this.sineWave.frequency.value = 24000
      }else{
        this.gainNode.gain.value = 1
        this.sineWave.frequency.value = $("#sinus-slider")[0].value
      }    
      this.muted = mute
  }


// --------------------------------------
    return EffectSinus
  })()
  return module.exports = EffectSinus
})