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
      this.mute()
    }


    EffectSinus.prototype.initView = function(){
      var that = this
      $("#sinus-slider").on("input change", function(event){
        that.updateFrequency(parseInt(event.target.value))
        $("#sinus-slider-output").html("Frequency: "+parseInt(event.target.value)+" hz")}
      ) 

      $("#sinus-wave-toggle").on("change", function(event){
        that.mute(event.target.checked)
        }
      )       
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
    }   



// --------------------------------------
    return EffectSinus
  })()
  return module.exports = EffectSinus
})