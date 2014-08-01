/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'assets/lib/three.min.js',
    'assets/lib/improvedNoise.js',  
  ], function(
  ) {

var Visualization, _ref, module,


  module = function() {}
  Visualization = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Visualization(containerIdentifier, musicPlayer, effects){ 

      this.musicPlayer = musicPlayer
      this.effects = effects
      this.container = $("#canvas-live-container")
    }


    Visualization.prototype.activateResizeListener = function(){
      window.addEventListener( 'resize', function(){this.callResize();}.bind(this), false );
    }

    Visualization.prototype.callResize = function(){
      if (this.timeout !== 0){
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(function(){this.resize()}.bind(this),200);
    }

    Visualization.prototype.initialize = function(){
      this.initRenderer()
      this.initScene()
      this.addSceneObjects()
    }

    Visualization.prototype.start = function(){
      var that = this 
      this.intervalId = setInterval(function() {
        that.aniamationId = requestAnimationFrame(function(){that.renderScene()})
      }, 25);       
    }

    Visualization.prototype.resize = function(){
      console.error("Implement this function in child class!")
    }

    Visualization.prototype.initRenderer = function(){
      console.error("Implement this function in child class!")
    }

    Visualization.prototype.initScene = function(){
      console.error("Implement this function in child class!")
    } 

    Visualization.prototype.addSceneObjects = function(){
      console.error("Implement this function in child class!")
    }
       
    Visualization.prototype.updateScene = function(){
      console.error("Implement this function in child class!")
    }   

    Visualization.prototype.renderScene = function(){
      if(this.musicPlayer.isPlaying() || this.effects.activity()){
        this.updateScene()
        this.renderer.render(this.scene, this.camera)        
      }
      
    }

    Visualization.prototype.stop = function(){
      console.log("stop")
      cancelAnimationFrame(this.animationId)
      clearInterval(this.intervalId)
      this.renderer.domElement.addEventListener('dblclick', null, false)
      $("#the-canvas").remove()
      // this.scene = this.projector = this.camera = null
    }

  


// --------------------------------------
    return Visualization
  })()
  return module.exports = Visualization
})