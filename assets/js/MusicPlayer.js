/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/Effects',
  'js/Visualization'
  ], function(
    Effects,
    Visualization
  ) {

  var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------

    function MusicPlayer(){   

      this.effects = new Effects(this)
      this.visualization = new Visualization(this)

      this.playing = false
      this.mediaPath = './assets/media/audio/'
      this.extension = ''

      this.initialize()
      //this.runTests()
    }

    MusicPlayer.prototype.initialize = function(){
      this.initializePlayer()
      this.loadDefaultTracks()
    }

    MusicPlayer.prototype.initializePlayer = function(){

      this.audio = $("#audio-player")[0]

      var that = this
      this.audio.addEventListener('play',  function(){that.playAction(that)}, false)
      this.audio.addEventListener('pause', function(){that.pauseAction(that)}, false)
      this.audio.addEventListener('ended', function(){that.endedAction(that)}, false)   
    }

    MusicPlayer.prototype.playAction = function(player){
      this.playing = true
      // npAction.text('Now Playing:');
      console.log("play")
    }

    MusicPlayer.prototype.pauseAction = function(player){
      this.playing = true
      console.log("pause")
      // npAction.text('Now Playing:');
    }

    MusicPlayer.prototype.endedAction = function(player){
      // npAction.text('Now Playing:');
      // if((index + 1) < trackAmount) {
      //         index++;
      //         loadTrack(index);
      //         audio.play();
      //       } else {
      //         audio.pause();
      //         index = 0;
      //         loadTrack(index);
      //       }
    }


    MusicPlayer.prototype.loadDefaultTracks = function(){
      this.tracks = Array()

      this.tracks.push({
        track: 1, 
        name :"001", 
        length: "00:55", 
        fileName: "test",
        extension: "ogg"
      });

    }



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})