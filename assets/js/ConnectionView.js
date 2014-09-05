/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-equalizer.html',
    'text!data/presets.json',
    'assets/js/Effect.js'
  ], function(
      effectTemplate,
      presets,
      Effect
  ) {

var ConnectionView, _ref, module,


  module = function() {}
  ConnectionView = (function(_super){
    // __extends(Equalizer, Effect);
// --------------------------------------


    function ConnectionView(musicplayer){   
      this.filterTestEnabled = false
      this.equalizerEnabled = false
      this.bbEnabled = false

      this.initialize()
    }

    ConnectionView.prototype.initialize = function(){
      this.initEventListeners()
      this.connect()
    }


    ConnectionView.prototype.initEventListeners = function(){
      var that = this
    
      $("#filter-select").change(function(e){
        that.connect()
      })

      $("#microphone-effect-toggle").on("change", function(event){
        that.updateMicrophone(event.target.checked)     
      })

      $("#wave-effect-toggle").on("change", function(event){
        that.updateSine(event.target.checked)          
      })

      $("#equalizer-effect-toggle").on("change", function(event){        
          console.log("event")
          if(!!event.target.checked){
            that.equalizerEnabled = true
          }else{
            that.equalizerEnabled = false
          }

          that.connect() 
        }
      )

      $("#equalizer-bass-toggle").on("change", function(event){

          if(!!event.target.checked){
            that.bbEnabled = true
          }else{
            that.bbEnabled = false
          }

          that.connect()
        }
      )

      $("#filter-test-toggle").on("change", function(event){ 

          if(!!event.target.checked){
            that.filterTestEnabled = true
          }else{
            that.filterTestEnabled = false
          }

          that.connect()       
        }
      )      
      
      $("#filter-select").change(function(e){
        var type = e.target.options[e.target.selectedIndex].text
        that.updateTestFilter(type, 'filter-type')
      })

    }

    ConnectionView.prototype.updateMicrophone = function(on){
      if(on){
        $(".microphone.active-link").css({"opacity":"1.0"})
      }else{
        $(".microphone.active-link").css({"opacity":"0.0"})
      }
    }

    ConnectionView.prototype.updateSine = function(on){
      if(on){
        $(".wave.active-link").css({"opacity":"1.0"})
      }else{
        $(".wave.active-link").css({"opacity":"0.0"})
      }      
    }    

    ConnectionView.prototype.updateFilter = function(value, filterNumber){
      this.filters[filterNumber].gain.value = value
    }   

    ConnectionView.prototype.connect = function(){
      $(".active-link").css({"opacity":"0.0"})

      // blug equalizer
      if(this.equalizerEnabled){
        $(".equ.active-link").css({"opacity":"1.0"})
        if(this.bbEnabled){
          $(".equ-to-bass.active-link").css({"opacity":"1.0"})
          if(this.filterTestEnabled){
            this.showFilterConnection()
            $(".bass-to-filter.active-link").css({"opacity":"1.0"})
          }else{
            $(".bass-to-filter.active-link").css({"opacity":"0.0"})
            $(".bass-to-destination.active-link").css({"opacity":"1.0"})
          }
        }else{
          $(".equ-to-bass.active-link").css({"opacity":"0.0"})
          if(this.filterTestEnabled){
            this.showFilterConnection()
            $(".equ-to-filter.active-link").css({"opacity":"1.0"})
          }else{
            $(".equ-direct.active-link").css({"opacity":"1.0"})
          }
        }
      }else{
        if(this.bbEnabled){
            $(".source-bass.active-link").css({"opacity":"1.0"})
          if(this.filterTestEnabled){
            this.showFilterConnection()
            $(".bass-to-filter.active-link").css({"opacity":"1.0"})
          }else{
            $(".bass-to-destination.active-link").css({"opacity":"1.0"})
          }
        }else if(this.filterTestEnabled){
          this.showFilterConnection()
          $(".source-filter.active-link").css({"opacity":"1.0"})
        }
      } 

      // plug bass boost
      if(this.bbEnabled){

      }

      // plug testfilter
      if(!!this.filterTestEnabled){
        $(".filter.active-link").css({"opacity":"1.0"})
      }

      if(!this.filterTestEnabled && !this.bbEnabled && !this.equalizerEnabled){
        $(".direct.active-link").css({"opacity":"1.0"})
      }

    }

    ConnectionView.prototype.showFilterConnection = function(){
        var filter = $("#filter-select")[0].options[$("#filter-select")[0].selectedIndex].value

        $("."+filter+"-in.active-link").css({"opacity":"1.0"})
        $("."+filter+"-out.active-link").css({"opacity":"1.0"})
    }     

    ConnectionView.prototype.enable = function(){
        this.equalizerEnabled = true
        this.connect()
    } 
    ConnectionView.prototype.disable = function(){
        this.equalizerEnabled = false
        this.connect()
    }     


// --------------------------------------
    return ConnectionView
  })()
  return module.exports = ConnectionView
})