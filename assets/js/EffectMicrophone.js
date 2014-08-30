/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-microphone.html',
    'assets/js/Effect.js',
  ], function(
      effectTemplate,
      Effect
  ) {

var EffectMicrophone, _ref, module,


  module = function() {}
  EffectMicrophone = (function(_super){
    __extends(EffectMicrophone, Effect);
// --------------------------------------


    function EffectMicrophone(musicplayer){   

      this.musicplayer = musicplayer

      this.container = $(Effect.CONTAINER).append($(effectTemplate))
      this.initialize()
      
    }


    EffectMicrophone.prototype.initView = function(){
      var that = this

      $("#microphone-effect-toggle").on("change", function(event){
          var wrapper = $(this).closest('.effect-wrapper')[0]
          $(wrapper).toggleClass('inactive')  

          that.updateOutput()
          setTimeout(function(){that.mute(!event.target.checked)}, 300)           
        })
    }

    EffectMicrophone.prototype.updateOutput = function(){
     
    }

    EffectMicrophone.prototype.initEffect = function(){

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia;  

      if(navigator.getUserMedia){
        var that = this
        navigator.getUserMedia(
          {audio: true, video: false}, 
          function(stream){that.connectMicrophone(stream)},
          function(e){console.log('capturing microphone failed: ', e)}
        )
      }
    }  

    EffectMicrophone.prototype.connectMicrophone = function(stream){
      this.microphone = this.musicplayer.getContext().createMediaStreamSource(stream);

      this.gainNode = this.musicplayer.addGainNode("effect-microphone")

      this.microphone.connect(this.gainNode)

      this.gainNode.connect(this.musicplayer.getAnalizer())
      window.test = this.gainNode
      this.mute(true)
    }  


// --------------------------------------
    return EffectMicrophone
  })()
  return module.exports = EffectMicrophone
})