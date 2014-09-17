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

    Visualization.prototype.FPS = 20

    function Visualization(containerIdentifier, musicPlayer, effects){ 

      this.musicPlayer = musicPlayer
      this.effects = effects
      this.container = $("#canvas-live-container")
      this.renderer = this.getRenderer()
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

    Visualization.prototype.initializeScene = function(){
      this.initScene()
      this.addSceneObjects()
    }

    Visualization.prototype.start = function(){
      var that = this 
      this.intervalId = setInterval(function() {
        that.aniamationId = requestAnimationFrame(function(){that.renderScene()})
      }, 1000/Visualization.prototype.FPS);       
    }

    Visualization.prototype.resize = function(){
      console.error("Implement this function in child class!")
    }

    Visualization.prototype.getRenderer = function(){

      if(!Visualization.prototype._renderer){
        console.log("create renderer")
        if(!!this.canvas)
          this.canvas.remove()

        var rendererOptions = {
            antialias: true
          , 
        }

        Visualization.prototype._renderer = new THREE.WebGLRenderer(rendererOptions)
        Visualization.prototype._renderer.setSize(window.innerWidth, window.innerHeight)

        this.canvas = Visualization.prototype._renderer.domElement
        this.canvas.id = "the-canvas"
        this.container.append($(this.canvas))
      }

      return Visualization.prototype._renderer
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
        // console.log(this.camera)
        this.renderer.render(this.scene, this.camera)  
      }
    }

    Visualization.prototype.stop = function(){
      console.log("stop animation")
      cancelAnimationFrame(this.animationId)
      clearInterval(this.intervalId)
      var that = this
      setTimeout(function(){that.scene = that.projector = that.camera = null},200);
    }

  


// --------------------------------------
    return Visualization
  })()
  return module.exports = Visualization
})