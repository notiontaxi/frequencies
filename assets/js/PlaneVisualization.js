/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'assets/js/Visualization.js',
  ], function(
    Visualization
  ) {

var PlaneVisualization, _ref, module,


  module = function() {}
  PlaneVisualization = (function(_super){
    __extends(PlaneVisualization, Visualization);
// --------------------------------------


    function PlaneVisualization(containerIdentifier, musicPlayer, effects){ 
      PlaneVisualization.__super__.constructor(containerIdentifier, musicPlayer, effects)

      this.size = window.uniformAmount

      this.initializeScene()
      this.activateResizeListener()
      this.start()  
    }

    PlaneVisualization.prototype.resize = function(){
      this.initializeScene()
    }

    PlaneVisualization.prototype.initScene = function(){

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

    PlaneVisualization.prototype.addSceneObjects = function(){

      var material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true})

      this.geometry = new THREE.PlaneGeometry(80,100, this.size, 25)
      this.mesh = new THREE.Mesh(this.geometry, material);
      this.mesh.rotation.x -= 1.3

      this.scene.add(this.mesh)
    }
       
    PlaneVisualization.prototype.updateScene = function(){

      if(this.musicPlayer.frequencies){
        var time = .001 * Date.now();
        var vertex, meshPosition, copyFrom, copyTo, value
        var i,j
        var verticesLength = this.geometry.vertices.length -3
        var timeOffset = 1
        var width = this.musicPlayer.frequencies.length -1
        var length = 25

        var width = this.size
        // place values
        for(i = 0; i < length; i++){
          for(j = 0; j < width; j++){
            copyFrom = j + width*(i+1)+1
            copyTo = j + width*i
            this.geometry.vertices[copyTo].z = this.geometry.vertices[copyFrom].z * (1 - i*(1/300))
            // this.geometry.vertices[copyTo].z = this.geometry.vertices[copyFrom].z
          }          
        }

        width = this.musicPlayer.frequencies.length -1
        for(i = width; i >= 0; i--){
          meshPosition = verticesLength - width - i
          value = this.musicPlayer.frequencies[width - i] / 25
          vertex = this.geometry.vertices[meshPosition]
          vertex.z = value
        }
      
        // this.geometry.computeVertexNormals()
        this.geometry.computeFaceNormals()

        this.geometry.verticesNeedUpdate = true
        this.geometry.normalsNeedUpdate = true
      }
    }   

    PlaneVisualization.prototype.getGeometryVertices = function(){
      return this.geometry.vertices;
    }



// --------------------------------------
    return PlaneVisualization
  })()
  return module.exports = PlaneVisualization
})