/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/Effects',
  'js/Visualization',
  'text!templates/playlist-item.html',
  ], function(
    Effects,
    Visualization,
    playlistItem
  ) {

  var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------

    function MusicPlayer(){   

      this.effects = new Effects(this)
      this.visualization = new Visualization(this)
      this.playlistItemTemplate = playlistItem

      this.playing = false
      this.mediaPath = './assets/media/audio/'
      this.extension = ''
      this.trackInfo = $("#track-info")

      this.initialize()
      this.addEventListeners()
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

    MusicPlayer.prototype.fillPlayList = function(){
      var item
      var list = $("#playlist-list")

      for(var i = 0; i < this.tracks.length; i++){
        item = this.createPlaylistItem(this.tracks[i], i)
        list.append(item)
      }

    }

    MusicPlayer.prototype.createPlaylistItem = function(itemInfos, id) {
      var template = this.playlistItemTemplate
      template = template.replace("%id%", id)
      template = template.replace("%position%", itemInfos.position)
      template = template.replace("%title%", itemInfos.title)
      template = template.replace("%length%", itemInfos.length)

      return template
    }

    MusicPlayer.prototype.addEventListeners = function(){
      var that = this

      // change track by clicking on track
      $(".playlist-item").click(function(){
        var trackId = ($(this).attr( "list-id"))
        that.changeTrack(trackId)
      })
    }

    MusicPlayer.prototype.changeTrack = function(trackId){
      var track = this.tracks[trackId]
      this.audio.src = this.mediaPath + track.fileName + "."+track.extension;
      this.trackInfo.html(track.title)
      this.audio.play()      
    }

    MusicPlayer.prototype.loadDefaultTracks = function(){
      this.tracks = Array()

      this.tracks.push({
        position: 0, 
        title :"Artificial Recreation", 
        fileName: "00_artificial_recreation",
        extension: "ogg",
        length: "04:02"
      });

      this.tracks.push({
        position: 1, 
        title :"Penguin Planet", 
        fileName: "01_penguin_planet",
        extension: "ogg",
        length: "03:52"
      });

      this.tracks.push({
        position: 2, 
        title :"Icarus Grounded", 
        fileName: "02_icarus_grounded",
        extension: "ogg",
        length: "04:24"
      });

      this.tracks.push({
        position: 3, 
        title :"George", 
        fileName: "03_george",
        extension: "ogg",
        length: "05:02"
      });

      this.tracks.push({
        position: 4, 
        title :"Inside", 
        fileName: "04_inside",
        extension: "ogg",
        length: "04:02"
      });                        

      this.fillPlayList()
    }



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})