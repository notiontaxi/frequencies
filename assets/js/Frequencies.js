/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'js/test/Test',
  'js/MusicPlayer',
  'js/Visualization',
  'js/Effects', 
  'js/GUI'
  ], function(
    Test,
    MusicPlayer,
    Visualization,
    Effects,
    GUI 
  ) {

var Frequencies, _ref, module,


  module = function() {}
  Frequencies = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Frequencies(containerIdentifier){   

      this.gui = new GUI(containerIdentifier)
      this.musicPlayer = new MusicPlayer()
      this.effects = new Effects(this.musicPlayer)
      this.visualization = new Visualization(containerIdentifier, this.musicPlayer, this.effects)

      this.initialize()
      
    }

    Frequencies.prototype.initialize = function(){

      this.initializeVisualizationWorker()
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