/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/canvas.html',
    'js/Effects',
    'assets/lib/three.min.js',
    'assets/lib/improvedNoise.js',
  ], function(
    canvasContainer,
    Effects
  ) {

var Visualization, _ref, module,


  module = function() {}
  Visualization = (function(_super){
    //__extends(ImageProcessing, CanvasGui);
// --------------------------------------


    function Visualization(containerIdentifier, musicPlayer){   

      this.effects = new Effects()  
      this.musicPlayer = musicPlayer

      this.container = $(containerIdentifier).append($(canvasContainer))

      var that = this
      window.addEventListener( 'resize', function(){that.initialize(that)}, false );   
      this.initialize(that)   
      this.renderScene()
    }

    Visualization.prototype.initialize = function(that){
      this.initRenderer(that)
      this.initScene(that)
      this.addSceneObjects(that)
    }


    Visualization.prototype.initRenderer = function(that){

      if(!!that.canvas)
        that.canvas.remove()

      var rendererOptions = {
          antialias: true
        , 
      }

      that.renderer = new THREE.WebGLRenderer(rendererOptions)
      that.renderer.setSize(window.innerWidth, window.innerHeight)

      that.canvas = that.renderer.domElement;
      that.container.append($(that.canvas))
    }

    Visualization.prototype.initScene = function(that){

      that.scene = new THREE.Scene()
      that.camera = new THREE.PerspectiveCamera(
          70 // angle
        , window.innerWidth / window.innerHeight // ratio
        , 10 // near plane
        , 1000 // far plane
        )
      that.camera.position.z = 100

      that.scene.add(this.camera)
    } 

    Visualization.prototype.addSceneObjects = function(that){

      var material = new THREE.MeshNormalMaterial({
          shading: THREE.FlatShading
        })

      // that.geometry = new THREE.IcosahedronGeometry(40,3)
      that.geometry = new THREE.BoxGeometry(10,10,10,10,10,10)
      that.mesh = new THREE.Mesh(that.geometry, material);

      that.scene.add(that.mesh)
    }
       
    Visualization.prototype.updateScene = function(){
      this.mesh.rotation.y += .01

      var time = .001 * Date.now();
      var vertex, distance

      for(var j = 0; j < this.geometry.vertices.length; j++){
        vertex = this.geometry.vertices[j]
        distance = 30 + 1 * Math.random()

        distance = 30 + 3 * ImprovedNoise().noise(
              .1 * vertex.x + 1.0 * time
            , .1 * vertex.y + 0.9 * time
            , .1 * vertex.z + 1.1 * time
          )

        vertex.normalize().multiplyScalar(distance)
      }

      this.geometry.computeVertexNormals()
      this.geometry.computeFaceNormals()

      this.geometry.verticesNeedUpdate = true
      this.geometry.normalsNeedUpdate = true
    }   

    Visualization.prototype.renderScene = function(){

      this.updateScene()
      this.renderer.render(this.scene, this.camera)


      var that = this
      requestAnimationFrame(function(){that.renderScene()})
    }

    Visualization.prototype.onWindowResize = function(event, that) {
        that.renderer.setSize(window.innerWidth, window.innerHeight)
    }


// --------------------------------------
    return Visualization
  })()
  return module.exports = Visualization
})