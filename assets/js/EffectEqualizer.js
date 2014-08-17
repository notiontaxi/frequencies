/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-equalizer.html',
    'assets/js/Effect.js',
  ], function(
      effectTemplate,
      Effect
  ) {

var EffectEqualizer, _ref, module,


  module = function() {}
  EffectEqualizer = (function(_super){
    __extends(EffectEqualizer, Effect);
// --------------------------------------


    function EffectEqualizer(musicplayer){   

      this.musicplayer = musicplayer

      this.container = $(Effect.CONTAINER).append($(effectTemplate))
      this.initialize()
      this.mute(true)
    }


    EffectEqualizer.prototype.initView = function(){
      var that = this
      $("#wave-effect-slider").on("input change", function(event){
          if(!that.muted){
            that.updateFrequency(parseInt(event.target.value))
          }
        }
      )

      $("#equalizer-effect-toggle").on("change", function(event){
        that.mute(!event.target.checked)
        }
      )
         
    }



    EffectEqualizer.prototype.initEffect = function(){

      this.sineWave = this.musicplayer.getContext().createOscillator()
      this.sineWave.frequency.value = 400

      this.sineWave.connect(this.musicplayer.getAnalizer())

      this.gainNode = this.musicplayer.addGainNode("effect-sinus")

      this.sineWave.connect(this.gainNode)

      this.gainNode.connect(this.musicplayer.getContext().destination)
      this.sineWave.start(0)
    }    

    EffectEqualizer.prototype.updateFrequency = function(frequency){
      this.sineWave.frequency.value = frequency
      this.updateOutput()
    }   




// --------------------------------------
    return EffectEqualizer
  })()
  return module.exports = EffectEqualizer
})