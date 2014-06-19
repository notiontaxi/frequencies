/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
    'text!templates/canvas.html',
    'js/Effects',
    'assets/lib/three.min.js',
    'assets/lib/ImprovedNoise.js',
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

      this.initialize()
      this.renderScene()
    }

    Visualization.prototype.initialize = function(){
      this.initRenderer()
      this.initScene()
      this.addSceneObjects()
    }

    Visualization.prototype.initRenderer = function(){
      var rendererOptions = {
          antialias: true
        , 
      }

      this.renderer = new THREE.WebGLRenderer(rendererOptions)
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      var container = this.renderer.domElement;
      this.container.append($(container))

    }

    Visualization.prototype.initScene = function(){

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(
          70 // angle
        , window.innerWidth / window.innerHeight // ratio
        , 10 // near plane
        , 1000 // far plane
        )
      this.camera.position.z = 100

      this.scene.add(this.camera)
    } 

    Visualization.prototype.addSceneObjects = function(){

      var material = new THREE.MeshNormalMaterial({
          shading: THREE.FlatShading
        })

      // this.geometry = new THREE.IcosahedronGeometry(40,3)
      this.geometry = new THREE.CubeGeometry(10,10,10,10,10,10)
      this.mesh = new THREE.Mesh(this.geometry, material);

      this.scene.add(this.mesh)
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



// --------------------------------------
    return Visualization
  })()
  return module.exports = Visualization
})