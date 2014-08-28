/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/effect-equalizer.html',
    'assets/js/Effect.js'
  ], function(
      effectTemplate,
      Effect
  ) {

var Equalizer, _ref, module,


  module = function() {}
  Equalizer = (function(_super){
    // __extends(Equalizer, Effect);
// --------------------------------------


    function Equalizer(musicplayer){   

      this.musicplayer = musicplayer
      this.equalizerEnabled = false
      this.bbEnabled = false
      this.filterTestEnabled = false
      this.filters = Array()

      this.container = $(Effect.CONTAINER).append($(effectTemplate))

      // cout occurencies of sliders in template
      var count = effectTemplate.match(/eq-slider-/g)
      this.filterAmount = count.length

      this.initialize()

    }

    Equalizer.prototype.initialize = function(){
      this.initFilters()
      this.initBassBoost()
      this.initTestFilter()
      this.initView()
    }

    Equalizer.prototype.initView = function(){
      var that = this

      for(var i = 0; i < this.filterAmount; i++){
        $("#eq-slider-0"+i).on("input change", function(event){
              that.updateFilter(parseFloat(event.target.value), parseInt($(this).attr('nr')))
          }
        )
      }

      $("#filter-frequency").on("input change", function(event){
        that.updateTestFilter(parseFloat(event.target.value), 'frequency')
      })
      $("#filter-quality").on("input change", function(event){
        that.updateTestFilter(parseFloat(event.target.value), 'quality')
      })
      $("#filter-gain").on("input change", function(event){
        that.updateTestFilter(parseFloat(event.target.value), 'gain')
      })            

      $("#equalizer-effect-toggle").on("change", function(event){
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
          that.connectTestFilter()
        }
      )      
      
      $("#filter-select").change(function(e){
        var type = e.target.options[e.target.selectedIndex].text
        that.updateTestFilter(type, 'filter-type')
      })

    }

    Equalizer.prototype.initBassBoost = function(){
      var context = this.musicplayer.getContext()
      this.bassBoost = context.createBiquadFilter()
      this.bassBoost.Q.value = 10
      this.bassBoost.type = 'peaking'
      this.bassBoost.frequency.value = 50
      this.bassBoost.gain.value = 30      
    }

    Equalizer.prototype.bassBoost = function(enable){
      if(enable){
        this.getBandPassInterface().connect(this.bassBoost)
      }else{
        this.getBandPassInterface().disconnect(this.bassBoost)
      }
    }

    Equalizer.prototype.initTestFilter = function(){

      this.testFilter = this.musicplayer.getContext().createBiquadFilter()

      this.testFilter.Q.value = 1
      this.testFilter.type = 'peaking'
      this.testFilter.frequency.value = 5000
      this.testFilter.gain.value = 30
    } 

    Equalizer.prototype.initFilters = function(){

      var context = this.musicplayer.getContext()
      var step = 20000/this.filterAmount


      for(var i = 1; i <= 1; i++){

        var filter = context.createBiquadFilter(2)

        filter.Q.value = 1
        filter.type = 'peaking'
        filter.frequency.value = 5000
        filter.gain.value = 30

        this.filters.push(filter)
      }
    }    

    Equalizer.prototype.getBandPassInterface = function(){
      return this.filters[0]
    }

    Equalizer.prototype.updateFilter = function(value, filterNumber){
      this.filters[0].frequency.value = value * 20000
    }   

    Equalizer.prototype.updateTestFilter = function(value, type){
      switch(type){
        case "frequency":
          this.testFilter.frequency.value = value
          console.log("update test frequency: "+value)
          break;
        case "quality":
          this.testFilter.Q.value = value
          break;
        case "gain":
          this.testFilter.gain.value = value
          break;
        case "filter-type":
          console.log("update test filter type: "+value)
          this.testFilter.type = value
          break;
      }
    }

    Equalizer.prototype.connectTestFilter = function(){
      
      this.musicplayer.getSource().disconnect(0)
      this.getBandPassInterface().disconnect(0)
      this.bassBoost.disconnect(0)
      this.testFilter.disconnect(0)


      if(this.filterTestEnabled){
          this.musicplayer.getSource().connect(this.testFilter)
          this.testFilter.connect(this.getBandPassInterface())
          this.getBandPassInterface().connect(this.musicplayer.getContext().destination)
          this.getBandPassInterface().connect(this.musicplayer.getAnalizer())
          console.log("test filter enabled")
      }else{
        this.connect()
      }
    }

    Equalizer.prototype.connect = function(){

      this.musicplayer.getSource().disconnect(0)
      this.getBandPassInterface().disconnect(0)
      this.bassBoost.disconnect(0)

      if(this.equalizerEnabled){
        if(this.bbEnabled){
          this.musicplayer.getSource().connect(this.bassBoost)
          this.bassBoost.connect(this.getBandPassInterface())
        }else{
          this.musicplayer.getSource().connect(this.getBandPassInterface())
        }
        this.getBandPassInterface().connect(this.musicplayer.getContext().destination)
        this.getBandPassInterface().connect(this.musicplayer.getAnalizer()) 
      }else{
        if(this.bbEnabled){
          this.musicplayer.getSource().connect(this.bassBoost)
          this.bassBoost.connect(this.musicplayer.getContext().destination)
          this.bassBoost.connect(this.musicplayer.getAnalizer())
        }else{
          this.musicplayer.getSource().connect(this.musicplayer.getContext().destination)
          this.musicplayer.getSource().connect(this.musicplayer.getAnalizer())
        }               
      }
    }

    Equalizer.prototype.enable = function(){
        this.equalizerEnabled = true
        this.connect()
    } 
    Equalizer.prototype.disable = function(){
        this.equalizerEnabled = false
        this.connect()
    }     




// --------------------------------------
    return Equalizer
  })()
  return module.exports = Equalizer
})