/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/test/Test',
  'js/MusicPlayer',
  'js/Visualization',
  'js/PlaneVisualization',
  'js/ShaderVisualization',
  'js/ShaderVisualizationSimple',
  'js/Effects', 
  'js/GUI'
  ], function(
    Test,
    MusicPlayer,
    Visualization,
    PlaneVisualization,
    ShaderVisualization,
    ShaderVisualizationSimple,
    Effects,
    GUI
  ) {

var Frequencies, _ref, module,


  module = function() {}
  Frequencies = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Frequencies(containerIdentifier){   

      this.containerIdentifier = containerIdentifier
      this.gui = new GUI(containerIdentifier)
      this.musicPlayer = new MusicPlayer()
      this.effects = new Effects(this.musicPlayer)
      this.visualization = new PlaneVisualization(containerIdentifier, this.musicPlayer, this.effects)

      this.initialize()
      
    }

    Frequencies.prototype.initialize = function(){
      this.initSelectionTool()
      // this.initializeVisualizationWorker()
    }

    Frequencies.prototype.initSelectionTool = function(){

      var select = $("#visu-select");

      if(!window.isTouchDevice){
        var option = document.createElement('option')
        option.innerHTML = "Plane"
        option.value = 0
        select.append(option)   

        var option = document.createElement('option')
        option.innerHTML = "Ball"
        option.value = 1
        select.append(option)

        var option = document.createElement('option')
        option.innerHTML = "Morphing ball"
        option.value = 2
        select.append(option)  

        var that = this
        select.change(function(e){
          that.changeVisualization(this.selectedIndex)
        })            
      }else{
        select.remove()
      }
      



    }

    Frequencies.prototype.changeVisualization = function(index){
      console.log("index: "+index)
      switch(index){
        case 0:
            this.visualization.stop()
            this.visualization = new PlaneVisualization(this.containerIdentifier, this.musicPlayer, this.effects)
            break
        case 1: 
            this.visualization.stop()
            this.visualization = new ShaderVisualizationSimple(this.containerIdentifier, this.musicPlayer, this.effects)
            break
        case 2: 
            this.visualization.stop()
            this.visualization = new ShaderVisualization(this.containerIdentifier, this.musicPlayer, this.effects)
            break
      }

    }    

    Frequencies.prototype.initializeVisualizationWorker = function(){
      var that = this

      if(typeof(Worker) !== "undefined") {
        this.visuWorker = new Worker("assets/js/VisulizationWorker.js");
      } else {
          alert("No web worker support. Your browser is outdated!")
      }

      this.visuWorker.addEventListener('message', function(e) {
        // if(that.musicPlayer.isPlaying){
        //   that.visualization.updateVertices(e.data)
        // }
        // console.log("got it , recall")
        // window.setTimeout(function(){that.updateWorker()},50);
        // that.updateWorker()
      }, false);

      this.updateWorker()
    }

    Frequencies.prototype.updateWorker = function(){
        this.visuWorker.postMessage(
          { 
            "vertices": this.visualization.getGeometryVertices(),
            "frequencies": this.musicPlayer.frequencies
          }
        );
    }

    Frequencies.prototype.runTests = function(){
      // var test = new Test()
    }


// --------------------------------------
    return Frequencies
  })()
  return module.exports = Frequencies
})