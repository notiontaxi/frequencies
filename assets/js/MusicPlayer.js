/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'text!templates/playlist-item.html',
  ], function(
    playlistItem
  ) {

  var MusicPlayer, _ref, module,


  module = function() {}
  MusicPlayer = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------

    function MusicPlayer(){   
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
      this.addPlaylistListeners()
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
      var position = 0

      if(this.tracks.length > 1){
        var random = Math.floor(Math.random()*this.tracks.length);

        // regenerate, if random title is the last played
        if(random == this.lastPlayed[this.lastPlayed.length-1])
          position = this.getRandomTrackId()
        else
          position = random
      }

      return position
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

      this.audio.src = track.src
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
      this.addPlaylistItemListeners()
    }

    MusicPlayer.prototype.deleteTrack = function(trackId){
      this.tracks.splice(trackId, 1)
      this.setNewPlaylist(this.tracks)
    }

    MusicPlayer.prototype.addTrack = function(src, folder, filename, extension, title, length){
      this.tracks.push({
        title : title, 
        fileName: filename,
        extension: extension,
        length: length,
        folder: folder,
        src: src
      });

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


    MusicPlayer.prototype.addPlaylistItemListeners = function(){
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

    MusicPlayer.prototype.addPlaylistListeners = function(){
      var that = this

      $(".action-add").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        $("#open-file-dialog").click()
      }) 

      $(".action-clear").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        that.tracks = Array()
        that.setNewPlaylist(that.tracks)
      })  

      $(".action-load-default-playlist").click(function(event){
        event.stopPropagation()
        event.preventDefault()
        that.loadDefaultTracks();
      })               

      $("#open-file-dialog").change(function(event){
        event.stopPropagation()
        event.preventDefault()        
        that.openFile(event, that);
      })  
    }    

    MusicPlayer.prototype.openFile = function(event, that){
      var files = event.target.files

      for(var i = 0; i < files.length; i++){
        var file = files[i]
        var extension = file.name.split(".")[1]
        
        var extest = extension.toLowerCase()
        if(extest == "ogg" || extest == "mp3" || extest == "wav"){
          var name = file.name.split(".")[0]
          var src = URL.createObjectURL(file)
          that.addTrack(src, "unknown", name, extension, name, 0)
        }
      }
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
      // save as JSON file and parse -> save/load playlists
      var tracks = Array()
      tracks.push({
        title :"Magic Mushroom", 
        fileName: "01_magic_mushrooms",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "01_magic_mushrooms" + "."+"ogg"
      });

      tracks.push({
        title :"Icarus Grounded", 
        fileName: "02_icarus_grounded",
        extension: "ogg",
        length: "03:52",
        folder: this.mediaPath,
        src: this.mediaPath + "02_icarus_grounded" + "."+"ogg"
      });

      tracks.push({
        title :"Monkey Bones", 
        fileName: "03_monkey_bones",
        extension: "ogg",
        length: "04:24",
        folder: this.mediaPath,
        src: this.mediaPath + "03_monkey_bones" + "."+"ogg"
      });

      tracks.push({
        title :"George", 
        fileName: "04_george",
        extension: "ogg",
        length: "05:02",
        folder: this.mediaPath,
        src: this.mediaPath + "04_george" + "."+"ogg"
      });

      tracks.push({
        title :"Inside", 
        fileName: "05_inside",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "05_inside" + "."+"ogg"
      });     

      tracks.push({
        title :"Fallen Trees", 
        fileName: "06_fallen_trees",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "06_fallen_trees" + "."+"ogg"
      });

      tracks.push({
        title :"Whispered", 
        fileName: "07_whispered",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "07_whispered" + "."+"ogg"
      });

      tracks.push({
        title :"Mr Schwinn", 
        fileName: "08_mr_schwinn",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "08_mr_schwinn" + "."+"ogg"
      });

      tracks.push({
        title :"Dance", 
        fileName: "09_dance",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "09_dance" + "."+"ogg"
      });

      tracks.push({
        title :"The Coming Through", 
        fileName: "10_the_coming_through",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "10_the_coming_through" + "."+"ogg"
      });

      tracks.push({
        title :"The March Of The Goblins", 
        fileName: "11_the_march_of_the_goblins",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "11_the_march_of_the_goblins" + "."+"ogg"
      });    

      tracks.push({
        title :"Penguin Planet", 
        fileName: "12_penguin_planet",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "12_penguin_planet" + "."+"ogg"
      });   

      tracks.push({
        title :"The Wave", 
        fileName: "13_the_wave",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "13_the_wave" + "."+"ogg"
      });   

      tracks.push({
        title :"Artificial Recreation", 
        fileName: "14_artificial_recreation",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "14_artificial_recreation" + "."+"ogg"
      });                  

      this.setNewPlaylist(tracks)
    }



// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})