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

var Equalizer, _ref, module,


  module = function() {}
  Equalizer = (function(_super){
    // __extends(Equalizer, Effect);
// --------------------------------------


    function Equalizer(musicplayer){   

      this.presets = JSON.parse(presets).presets
      this.musicplayer = musicplayer
      this.equalizerEnabled = false
      this.bbEnabled = false
      this.filterTestEnabled = false
      this.filters = Array()

      this.container = $(Effect.CONTAINER).append($(effectTemplate))

      // cout occurencies of sliders in template
      // var count = effectTemplate.match(/eq-slider-/g)
      this.filterAmount = 10 //count.length
      this.filterValues = Array(.032,.064,.125,.250,.5,1,2,4,8,16)

      this.initialize()

    }

    Equalizer.prototype.initialize = function(){
      this.initGainNode()
      this.initFilters()
      this.initBassBoost()
      this.initTestFilter()
      this.initView()
      this.initEventListeners()
    }

    Equalizer.prototype.initView = function(){

      var select = $("#preset-select")

      for(var i = 0; i < this.presets.length; i++){
        var option = document.createElement('option')
        option.text = this.presets[i].name
        option.value = this.presets[i].name
        select.append(option)
      }
      
    }

    Equalizer.prototype.initEventListeners = function(){
      var that = this

      $("#preset-select").change(function(e){
        var name = e.target.options[e.target.selectedIndex].text
        that.changePreset(name)
      })

      for(var i = 0; i < this.filterAmount; i++){
        $("#eq-slider-0"+i).on("input change", function(event){
              var nr = parseInt($(this).attr('nr')),
                  val = parseFloat(event.target.value)
              that.updateFilter(val, nr)
              $("#eq-slider-0"+nr+"-output").html(val)
          }
        )
      }

      $("#eq-slider-gain").on("input change", function(event){
        that.updateGain(event.target.value, 'frequency')
        $("#eq-slider-gain-output").html(event.target.value*100+"%")
      })

      $("#filter-frequency").on("input change", function(event){
        that.updateTestFilter(event.target.value, 'frequency')
        $("#filter-frequency-output").html(event.target.value)
      })
      $("#filter-quality").on("input change", function(event){
        that.updateTestFilter(parseFloat(event.target.value), 'quality')
        $("#filter-quality-output").html(parseFloat(event.target.value))
      })
      $("#filter-gain").on("input change", function(event){
        that.updateTestFilter(parseFloat(event.target.value), 'gain')
        $("#filter-gain-output").html(parseFloat(event.target.value))
      })            

      $("#equalizer-effect-toggle").on("change", function(event){
          var wrapper = $(this).closest('.effect-wrapper')[0]
          $(wrapper).toggleClass('inactive')          

          if(!!event.target.checked){
            that.equalizerEnabled = true
          }else{
            that.equalizerEnabled = false
          }

          setTimeout(function(){that.connect();}, 400)   

          if(window.isTouchDevice){
            setTimeout(function(){$("#effects-container").niceScroll({cursorborder:"",cursorcolor:"#FFF",cursorwidth:"8px",  autohidemode:true})   }, 1000)  
          }   
          
        }
      )

      $("#equalizer-bass-toggle").on("change", function(event){
          var wrapper = $(this).closest('.effect-wrapper')[0]
          $(wrapper).toggleClass('inactive')

          if(!!event.target.checked){
            that.bbEnabled = true
          }else{
            that.bbEnabled = false
          }

          setTimeout(function(){that.connect();}, 400)
        }
      )

      $("#filter-test-toggle").on("change", function(event){
          var wrapper = $(this).closest('.effect-wrapper')[0]
          $(wrapper).toggleClass('inactive')    

          if(!!event.target.checked){
            that.filterTestEnabled = true
          }else{
            that.filterTestEnabled = false
          }

          setTimeout(function(){that.connect();}, 300)         
        }
      )      
      
      $("#filter-select").change(function(e){
        var type = e.target.options[e.target.selectedIndex].text
        that.updateTestFilter(type, 'filter-type')
      })

    }

    Equalizer.prototype.initGainNode = function(){
      this.gainNode = this.musicplayer.getContext().createGain() 
      this.gainNode.gain.value = 1.0
    }

    Equalizer.prototype.initBassBoost = function(){
      var context = this.musicplayer.getContext()
      this.bassBoost = context.createBiquadFilter()
      this.bassBoost.Q.value = .8
      this.bassBoost.type = 'peaking'
      this.bassBoost.frequency.value = 50
      this.bassBoost.gain.value = 7      
    }


    Equalizer.prototype.initTestFilter = function(){

      this.testFilter = this.musicplayer.getContext().createBiquadFilter()

      this.testFilter.Q.value = .9
      this.testFilter.type = 'lowpass'
      this.testFilter.frequency.value = 350
      this.testFilter.gain.value = 0
    } 

    Equalizer.prototype.initFilters = function(){

      var context = this.musicplayer.getContext()
      var step = 20000/this.filterAmount

      for(var i = 0; i < this.filterAmount; i++){

        var filter = context.createBiquadFilter()

        filter.Q.value = .2
        filter.type = 'peaking'
        filter.frequency.value = this.filterValues[i]*1000
        filter.gain.value = 0

        this.filters.push(filter)

        if(i > 0){
          this.filters[i-1].connect(this.filters[i])
          // console.log("connected "+(i-1)+" to "+i)
        }
      }
    }    

    Equalizer.prototype.getBandPassInterface = function(){
      return {
        first: this.filters[0], 
        last: this.filters[this.filters.length-1]
      }
    }

    Equalizer.prototype.updateFilter = function(value, filterNumber){
      this.filters[filterNumber].gain.value = value
    }   

    Equalizer.prototype.updateGain = function(value){
      this.gainNode.gain.value = value
    }

    Equalizer.prototype.updateTestFilter = function(value, type){
      switch(type){
        case "frequency":
          this.testFilter.frequency.value = value
          console.log("update test frequency: "+value,this.testFilter)
          break;
        case "quality":
          this.testFilter.Q.value = value
          console.log("set quality to "+value)
          break;
        case "gain":
          this.testFilter.gain.value = value
          console.log("set gain to "+value)
          break;
        case "filter-type":
          console.log("update test filter type: "+value)
          this.testFilter.type = value
          break;
      }
    }

    Equalizer.prototype.changePreset = function(name){
      
      var currentPreset

      for(var i = 0; i < this.presets.length; i++){
        
        if(this.presets[i].name == name){
          currentPreset = this.presets[i]
        }
      }
      
      for(var i = 0; i < currentPreset.values.length; i++){
        var val = parseInt(currentPreset.values[i])
        $("#eq-slider-0"+i)[0].value = val
        this.updateFilter(val, i)
        $("#eq-slider-0"+i+"-output").html(val)    
      }

    }

    Equalizer.prototype.connect = function(){

      this.musicplayer.getNodeApi().disconnect(0)
      this.getBandPassInterface().last.disconnect(0)
      this.bassBoost.disconnect(0)
      this.testFilter.disconnect(0)

      
      var lastFilter = this.musicplayer.getNodeApi()

      // blug equalizer
      if(this.equalizerEnabled){
        lastFilter.connect(this.gainNode)
        this.gainNode.connect(this.getBandPassInterface().first)
        lastFilter = this.getBandPassInterface().last
      }

      // plug bass boost
      if(this.bbEnabled){
        lastFilter.connect(this.bassBoost)
        lastFilter = this.bassBoost
      }

      // plug testfilter
      if(this.filterTestEnabled){
        lastFilter.connect(this.testFilter)
        lastFilter = this.testFilter
      }

      lastFilter.connect(this.musicplayer.getContext().destination)
      lastFilter.connect(this.musicplayer.getAnalizer())
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