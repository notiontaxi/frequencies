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
            var freq = parseInt(event.target.value)
            that.updateFrequency(freq)
        }
      )

      $("#wave-effect-toggle").on("change", function(event){
        var wrapper = $(this).closest('.effect-wrapper')[0]
        $(wrapper).toggleClass('inactive')   

        that.updateOutput();
        setTimeout(function(){that.mute(!event.target.checked)}, 400)        
        }
      )

      $('input[name="wave"]').change(function(){
        that.switchTypeTo(this.value)
      })           
    }

    EffectWave.prototype.updateOutput = function(freq){
      $("#wave-effect-slider-output").html(freq)
    }

    EffectWave.prototype.initEffect = function(){

      this.sineWave = this.musicplayer.getContext().createOscillator()
      this.sineWave.frequency.value = 400

      this.gainNode = this.musicplayer.addGainNode("effect-sinus")

      this.sineWave.connect(this.gainNode)

      this.sineWave.start(0)
    }    

    EffectWave.prototype.updateFrequency = function(frequency){
      this.sineWave.frequency.value = frequency
      this.updateOutput(frequency)
    }   

    EffectWave.prototype.switchTypeTo = function(type){
      this.sineWave.type = parseInt(type)
    }


// --------------------------------------
    return EffectWave
  })()
  return module.exports = EffectWave
})