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
      this.muted = false
      this.timeSliderIsMoving = false
      this.oldVolume = 1

      this.tracks = Array()
      this.lastPlayed = Array()
      // fill with objects like this: {node: gainNode, name: "myName"}
      this.gainNodes = Array() 

      this.context = new AudioContext()

      this.timestamp = 0

      this.mediaPath = './assets/media/audio/'
      this.extension = ''
      this.trackInfo = $("#track-info")

      this.pausedAt = this.startedAt = 0

      this.initialize()
      this.addEventListeners()
      this.addPlaylistListeners()
    }

    MusicPlayer.prototype.initialize = function(){
      this.createAudioContext()
      this.loadDefaultTracks()
      this.initAudioNodes()
      this.initRendering()
    }

    MusicPlayer.prototype.isPlaying = function(){
      return this.playing
    }

    MusicPlayer.prototype.initRendering = function(){
      var that = this
      setInterval(function() {
        if(that.isPlaying()){
          that.checkSongState()
          that.updateElements()
        }
      }, 1000);       
    }

    MusicPlayer.prototype.updateElements = function(){
      // update time display
      var time = (Date.now() - this.startedAt) / 1000
      var minutes = Math.floor(time / 60)
      var seconds = Math.round(time % 60)
      seconds = seconds < 10 ? "0"+seconds : seconds
      minutes = minutes < 10 ? "0"+minutes : minutes
      $("#time-code").html(minutes+":"+seconds)

      // update time slider
      if(!this.timeSliderIsMoving){
        var percent = time / this.sourceNode.buffer.duration * 100
        $("#time-slider").val(percent)
      }
    }

    MusicPlayer.prototype.checkSongState = function(){
      if(this.sourceNode.buffer){
        var time = (Date.now() - this.startedAt) / 1000

        if(time >= this.sourceNode.buffer.duration){
          this.pauseAction();
          this.nextTrack();
        }
      }
    }

    MusicPlayer.prototype.createAudioContext = function(){
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        this.context = new AudioContext();
      }
      catch(e) {
        alert('Web Audio API is not supported in this browser');
      }      
    }

    MusicPlayer.prototype.initAudioNodes = function(){
        var javascriptNode

        // creates a ScriptProcessorNode used for direct audio processing.
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.createScriptProcessor
        // [bufferSize][, numberOfInputChannels][, numberOfOutputChannels]
        this.javascriptNode = this.context.createScriptProcessor(0, 2, 2)
        // connect to destination, else it isn't called
        // setup a connection to an audionode
        // http://people.mozilla.org/~bgirard/doxygen/media/classmozilla_1_1dom_1_1ScriptProcessorNode.html        
        this.javascriptNode.connect(this.context.destination)


        // The AnalyserNode interface represents a node able to provide real-time frequency and time-domain analysis information.
        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
        this.analyser = this.context.createAnalyser()
        // Is a double value representing the averaging constant with the last analysis frame.
        this.analyser.smoothingTimeConstant = 0.8
        // Is an unsigned long value representing the size of the Fast Fourier Transform to be used to determine the frequency domain.
        this.analyser.fftSize = 1024

        // create a buffer source node
        this.sourceNode = this.context.createBufferSource()
        
        this.analyser.connect(this.javascriptNode)

        // Create gain node
        if (!this.context.createGain)
          this.context.createGain = this.context.creategainMusicNode        
        this.gainMusicNode = this.context.createGain()
        this.gainMusicNode.connect(this.context.destination)   
        this.gainNodes.push({node: this.gainMusicNode, name: "music"})

        this.connectNodes()
        this.initAudioProcess()  
    }

    MusicPlayer.prototype.connectNodes = function(){
      this.sourceNode.connect(this.context.destination)
      this.sourceNode.connect(this.analyser) 

      for(var i = 0; i < this.gainNodes.length; i++){
        this.sourceNode.connect(this.gainNodes[i].node)  
      }
    }  

    MusicPlayer.prototype.addGainNode = function(name){
        var gainNewNode = this.context.createGain()
        gainNewNode.connect(this.context.destination)           
        this.gainNodes.push({node: gainNewNode, name: name})
        this.sourceNode.connect(gainNewNode)
        return gainNewNode       
    }  

    MusicPlayer.prototype.getGainNode = function(name){
      var result = null
      for(var i = 0; i < this.gainNodes.length; i++){
        if(this.gainNodes[i].name == name){
          result = this.gainNodes[i]
        }
      } 
      return result
    }

    MusicPlayer.prototype.initAudioProcess = function(){
      var that = this

      this.javascriptNode.onaudioprocess = function() {
        // get the average for the first channel
        var array =  new Uint8Array(that.analyser.frequencyBinCount);
        that.analyser.getByteFrequencyData(array);
        that.frequencies = array
        // drawSpectrum(array);
        // console.log(array)
        // [255, 255, 207, 201, 216, 213, 184, 165, 162, 154, 135, 115, 107, 97, 60, 0] 

      }      
    }

    MusicPlayer.prototype.addEventListenerToSourceNode = function(){
      // var that = this
      // this.sourceNode.onended = function(){
      //   if(parseInt(that.sourceNode.context.currentTime) >= parseInt(that.sourceNode.buffer.duration))
      //     that.endedAction()
      // }
    }

    MusicPlayer.prototype.changeVolume = function(volume, maxVolume){
      if(maxVolume){
        var fraction = parseInt(volume) / parseInt(maxVolume)
        // x*x curve (x-squared)  value between -1 and 1
        this.gainMusicNode.gain.value = (fraction * fraction ) 
      }else{
         this.gainMusicNode.gain.value = volume
      }
    }

    MusicPlayer.prototype.changeTime = function(value, maxValue){
        this.pausedAt = (value / maxValue) * this.sourceNode.buffer.duration * 1000
        this.playAction()
        this.updateElements()
    }    

    MusicPlayer.prototype.playAction = function(){
      this.playing = true
      /*
      FINISHED_STATE: 3
      PLAYING_STATE: 2
      SCHEDULED_STATE: 1
      UNSCHEDULED_STATE: 0
      */
      if(this.sourceNode.playbackState == this.sourceNode.PLAYING_STATE)
        this.sourceNode.stop(0)

      // create new sourcenode and link to existing buffer
      this.sourceNode = this.context.createBufferSource()
      this.sourceNode.buffer = this.buffer
      this.addEventListenerToSourceNode()
      this.connectNodes()

      if (!this.sourceNode.start){
          this.sourceNode.start = this.sourceNode.noteOn
      }
      console.log("resuming from: "+this.pausedAt / 1000)
      this.sourceNode.start(0, this.pausedAt / 1000)
      this.startedAt = Date.now() - this.pausedAt
      
      this.updatePlayButton()
    }

    MusicPlayer.prototype.pauseAction = function(player){
      this.playing = false
      this.pausedAt = Date.now() - this.startedAt
      if (!this.sourceNode.stop){
        this.sourceNode.stop = source.noteOff
      }
      this.sourceNode.stop(0)
      console.log("paused at: "+this.pausedAt / 1000)
      this.updatePlayButton()
    }

    MusicPlayer.prototype.endedAction = function(){
      console.log("ended")
      if(this.isPlaying()){
        this.nextTrack()
      }
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

    MusicPlayer.prototype.togglePlay = function(){
      if(this.playing){
        this.pauseAction()
      }else{
        this.playAction()        
      }
    }

    MusicPlayer.prototype.toggleMute = function(){
      if(this.muted){
        this.changeVolume(this.oldVolume)
        this.muted = false
        $('.action-toggle-mute').removeClass("active")      
      }else{
        this.oldVolume = (this.gainMusicNode.gain.value)
        this.changeVolume(0)
        this.muted = true
        $('.action-toggle-mute').addClass("active")  
      }
    }    

    MusicPlayer.prototype.updatePlayButton = function(){
      if(this.playing){
        $("#play-button").removeClass("icon-play")
        $("#play-button").addClass("icon-pause")  
      }else{
        $("#play-button").removeClass("icon-pause")
        $("#play-button").addClass("icon-play")                      
      }
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


    MusicPlayer.prototype.switchBuffer = function(trackId){
      console.log("switching buffer")
      $("#overlay").show()
      this.pausedAt = 0

      this.currentTrackId = trackId;
      var track = this.tracks[this.currentTrackId]
      this.playlistScrollBar.doScrollTo(28*trackId)

      this.markTrackAsPlaying(track, trackId)
   
      var request = new XMLHttpRequest()
      request.open('GET', track.src, true)
      request.responseType = 'arraybuffer'
      
      if(this.sourceNode.playbackState !== this.sourceNode.UNSCHEDULED_STATE){
        this.sourceNode.stop(0)
      }      

      var that = this
      // When loaded decode the data
      request.onload = function() {

        try{
          // decode the data
          that.context.decodeAudioData(request.response, function(buffer) {
            // set new buffer for playback
            that.buffer = buffer
            that.sourceNode.buffer = that.buffer
            console.log("filled buffer")
            // check playing state and start playing if not playing
            if(that.sourceNode.playbackState !== that.sourceNode.PLAYING_STATE){
              that.playAction()
            }
            $("#overlay").hide()

          }, function(err){console.log(err)})                
        } catch(e) {
            console.log('Decoding failed: '+e.message);
        }

      }
      request.send()
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

      this.switchBuffer(id)    
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

      this.switchBuffer(id)      
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
      $(".action-toggle-play").click(function(event){that.togglePlay()})
      $(".action-toggle-mute").click(function(event){that.toggleMute()})   


      $("#volume-slider").on('input change', function(event){
        that.changeVolume(parseInt(event.target.value), parseInt(event.target.max))
      })  
       
      $("#time-slider").change(function(event){
        that.changeTime(parseInt(event.target.value), parseInt(event.target.max))
      })  
      $("#time-slider").mousedown( function(e){
          that.timeSliderIsMoving = true
      });
      $("#time-slider").mouseup( function(e){
          that.timeSliderIsMoving = false
      });                     
    }


    MusicPlayer.prototype.addPlaylistItemListeners = function(){
      var that = this
      // change track by clicking on track
      $(".playlist-item").click(function(){
        var trackId = ($(this).attr( "list-id"))
        that.switchBuffer(trackId)
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

    // TODO:
    // save as JSON file and parse -> save/load playlists
    MusicPlayer.prototype.loadDefaultTracks = function(){
      
      var tracks = Array()
      tracks.push({
        title :"Audiocheck", 
        fileName: "audiocheck",
        extension: "ogg",
        length: "04:02",
        folder: this.mediaPath,
        src: this.mediaPath + "audiocheck" + "."+"ogg"
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

    MusicPlayer.prototype.getContext = function(){
      return this.context;
    }
    MusicPlayer.prototype.getAnalizer = function(){
      return this.analyser;
    }         


// --------------------------------------
    return MusicPlayer
  })()
  return module.exports = MusicPlayer
})