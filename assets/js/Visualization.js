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
      window.addEventListener( 'resize', function(){that.initialize()}, false );   
      this.initialize(that)   
      this.renderScene()
    }

    Visualization.prototype.initialize = function(){
      this.initRenderer()
      this.initScene()
      this.addSceneObjects()
    }


    Visualization.prototype.initRenderer = function(){

      if(!!this.canvas)
        this.canvas.remove()

      var rendererOptions = {
          antialias: true
        , 
      }

      this.renderer = new THREE.WebGLRenderer(rendererOptions)
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.canvas = this.renderer.domElement;
      this.container.append($(this.canvas))
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

      var material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true})
      // var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors })
      // var material = new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true })

      // this.geometry = new THREE.IcosahedronGeometry(40,3)
      this.geometry = new THREE.PlaneGeometry(80,100, 256, 25)
      this.mesh = new THREE.Mesh(this.geometry, material);
      this.mesh.rotation.x -= 1.3


      this.scene.add(this.mesh)
    }
       
    Visualization.prototype.updateScene = function(){

      // this.mesh.rotation.y += .01
      if(!!this.musicPlayer.frequencies){

        var time = .001 * Date.now();
        var vertex, meshPosition, copyFrom, copyTo, value
        var i,j
        var verticesLength = this.geometry.vertices.length -3
        var timeOffset = 1
        var width = this.musicPlayer.frequencies.length -1

        width = 256
        // place values
        for(i = 0; i < 25; i++){
          for(j = 0; j < width; j++){
            copyFrom = j + width*(i+1)+1
            copyTo = j + width*i
            this.geometry.vertices[copyTo].z = this.geometry.vertices[copyFrom].z
          }          
        }

        width = this.musicPlayer.frequencies.length -1
        for(i = width; i >= 0; i--){
          meshPosition = verticesLength - width - i
          value = this.musicPlayer.frequencies[i] / 25
          vertex = this.geometry.vertices[meshPosition]
          vertex.z = value
        }
      
        this.geometry.computeVertexNormals()
        this.geometry.computeFaceNormals()

        this.geometry.verticesNeedUpdate = true
        this.geometry.normalsNeedUpdate = true
      }
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