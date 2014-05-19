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
      this.shuffle = false
      this.repeat = false

      this.tracks = Array()
      this.lastPlayed = Array()

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
    }

    MusicPlayer.prototype.pauseAction = function(player){
      this.playing = true
    }

    MusicPlayer.prototype.endedAction = function(player){
      this.nextTrack()
    }


    MusicPlayer.prototype.getRandomTrackId = function() {
      var random = Math.floor(Math.random()*this.tracks.length);

      // regenerate, if random title is the last played
      if(random == this.lastPlayed[this.lastPlayed.length-1])
        return this.getRandomTrackId()
      else
        return random
    }

    MusicPlayer.prototype.toggleShuffle = function(){
      this.shuffle = !this.shuffle
      var active = this.shuffle

      $(".action-shuffle").each(function(){
        active ? $(this).addClass("active") : $(this).removeClass("active")
      })
    }

    MusicPlayer.prototype.toggleRepeat = function(){
      this.repeat = !this.repeat
      var active = this.repeat

      $(".action-repeat").each(function(){
        active ? $(this).addClass("active") : $(this).removeClass("active")
      })
    }

    MusicPlayer.prototype.playTrack = function(trackId){

      this.currentTrackId = trackId;
      var track = this.tracks[this.currentTrackId]
      this.playlistScrollBar.doScrollTo(28*trackId)

      this.markTrackAsPlaying(track, trackId)

      this.audio.src = this.mediaPath + track.fileName + "."+track.extension;
      this.audio.play()      
      this.lastPlayed.push(this.currentTrackId)
    }

    MusicPlayer.prototype.previousTrack = function(){
      var id = 0
      if(this.repeat){
        id = this.currentTrackId
      }else if(this.shuffle){
        id = this.getRandomTrackId()
      }else{
        id = --this.currentTrackId
        id = id < 0 ? this.tracks.length-1 : id
      }     

      this.playTrack(id)    
    }

    MusicPlayer.prototype.nextTrack = function(){
      var id = 0
      if(this.repeat){
        id = this.currentTrackId
      }else if(this.shuffle){
        id = this.getRandomTrackId()
      }else{
        id = ++this.currentTrackId
        id = id >= this.tracks.length ? 0 : id
      }     

      this.playTrack(id)      
    }    

    MusicPlayer.prototype.setNewPlaylist = function(tracks){
      this.tracks = tracks
      this.updatePlaylistView()
      this.addPlaylistListeners()
    }

    MusicPlayer.prototype.deleteTrack = function(trackId){
      this.tracks.splice(trackId, 1)
      this.setNewPlaylist(this.tracks)
    }

    MusicPlayer.prototype.trackUp = function(trackId){
      if(trackId > 0){
        this.tracks.move(trackId, --trackId)
        this.setNewPlaylist(this.tracks)
      }
    }

    MusicPlayer.prototype.trackDown = function(trackId){
      if(trackId < this.tracks.length-1){
        this.tracks.move(trackId, ++trackId)
        this.setNewPlaylist(this.tracks)
      }      
    }    

// EVENT --------------------

    MusicPlayer.prototype.addEventListeners = function(){
      var that = this

      $(".left-sided")[0].addEventListener(whichTransitionEvent(), 
        function(event){
          if(event.propertyName == 'left'){
            if($(this).hasClass('slide-out')){
              that.playlistScrollBar.show()
              that.playlistScrollBar.resize()
            }
          }
        },false);
      $(".quarter-button.left").click(function()
        {
          if(!$($(".left-sided")[0]).hasClass('slide-out'))
            that.playlistScrollBar.hide()
        })
      

      $(".action-prev").click(function(event){that.previousTrack()})
      $(".action-next").click(function(event){that.nextTrack()})
      $(".action-shuffle").click(function(event){that.toggleShuffle()})
      $(".action-repeat").click(function(event){that.toggleRepeat()})
    }


    MusicPlayer.prototype.addPlaylistListeners = function(){
      var that = this
      // change track by clicking on track
      $(".playlist-item").click(function(){
        var trackId = ($(this).attr( "list-id"))
        that.playTrack(trackId)
      })
      $(".action-delete").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        that.deleteTrack($(this).parent().parent().attr( "list-id"))
      })
      $(".action-up").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        that.trackUp($(this).parent().parent().attr( "list-id"))
      })
      $(".action-down").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        that.trackDown($(this).parent().parent().attr( "list-id"))
      })    
    }
// VIEW --------------------


    MusicPlayer.prototype.markTrackAsPlaying = function(track, trackId){
      this.trackInfo.html(track.title)
      $(".playlist-item").each(function(){$(this).removeClass("active")})
      $($(".playlist-item")[trackId]).addClass("active")
    }

    MusicPlayer.prototype.updatePlaylistView = function(){
      var item
      var list = $("#playlist-list")
      list.empty()

      for(var i = 0; i < this.tracks.length; i++){
        item = this.createPlaylistItem(this.tracks[i], i)
        list.append(item)
      }

      var container = $("#playlist-list-container")
      // +20 for bottom + 30 for top
      var height = this.tracks.length*27
      var max = innerHeight*.7
      height = height < max ? height : max
      container.css({height: height+"px"})

      this.playlistScrollBar = container.niceScroll({cursorborder:"",cursorcolor:"#FFF",cursorwidth:"8px",  autohidemode:false})
    }    

    MusicPlayer.prototype.createPlaylistItem = function(itemInfos, id) {
      var template = this.playlistItemTemplate
      template = template.replace("%id%", id)
      template = template.replace("%position%", id)
      template = template.replace("%title%", itemInfos.title)
      template = template.replace("%length%", itemInfos.length)

      return template
    }

    MusicPlayer.prototype.loadDefaultTracks = function(){
      
      var tracks = Array()
      tracks.push({
        title :"Magic Mushroom", 
        fileName: "01_magic_mushrooms",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"Icarus Grounded", 
        fileName: "02_icarus_grounded",
        extension: "ogg",
        length: "03:52"
      });

      tracks.push({
        title :"Monkey Bones", 
        fileName: "03_monkey_bones",
        extension: "ogg",
        length: "04:24"
      });

      tracks.push({
        title :"George", 
        fileName: "04_george",
        extension: "ogg",
        length: "05:02"
      });

      tracks.push({
        title :"Inside", 
        fileName: "05_inside",
        extension: "ogg",
        length: "04:02"
      });     

      tracks.push({
        title :"Fallen Trees", 
        fileName: "06_fallen_trees",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"Whispered", 
        fileName: "07_whispered",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"Mr Schwinn", 
        fileName: "08_mr_schwinn",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"Dance", 
        fileName: "09_dance",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"The Coming Through", 
        fileName: "10_the_coming_through",
        extension: "ogg",
        length: "04:02"
      });

      tracks.push({
        title :"The March Of The Goblins", 
        fileName: "11_the_march_of_the_goblins",
        extension: "ogg",
        length: "04:02"
      });    

      tracks.push({
        title :"Penguin Planet", 
        fileName: "12_penguin_planet",
        extension: "ogg",
        length: "04:02"
      });   

      tracks.push({
        title :"The Wave", 
        fileName: "13_the_wave",
        extension: "ogg",
        length: "04:02"
      });   

      tracks.push({
        title :"Artificial Recreation", 
        fileName: "14_artificial_recreation",
        extension: "ogg",
        length: "04:02"
      });                  

      this.setNewPlaylist(tracks)
    }



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})