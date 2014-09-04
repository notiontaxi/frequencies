/*
Florian Wokurka (2014)
https://github.com/frequencies
*/

"use strict"

define([
  'assets/js/Visualization.js',
  'text!fragmentShader/FS_01.glsl',
  'text!vertexShader/VS_01.glsl'
  ], function(
    Visualization,
    fragmentShader,
    vertexShader
  ) {

var ShaderVisualization, _ref, module,


  module = function() {}
  ShaderVisualization = (function(_super){
    __extends(ShaderVisualization, Visualization);
// --------------------------------------


    function ShaderVisualization(containerIdentifier, musicPlayer, effects){ 
      ShaderVisualization.__super__.constructor(containerIdentifier, musicPlayer, effects)

      this.waitForPlayer()
    }

    ShaderVisualization.prototype.waitForPlayer = function(){
      if(!!this.musicPlayer.frequencies){
        this.initialize()
      }else{
        var that = this
        setTimeout(function() {that.waitForPlayer()}, 100);
      }
    }

    ShaderVisualization.prototype.initialize = function(){
      this.startTime = Date.now()
      this.initUniforms()
      this.initializeScene()
      this.activateResizeListener()

      this.oldBaseVal = 0

      this.start()  
    }

    ShaderVisualization.prototype.resize = function(){
        this.uniforms.resolution.value.x = window.innerWidth;
        this.uniforms.resolution.value.y = window.innerHeight;

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    ShaderVisualization.prototype.initUniforms = function(){

      var l = this.musicPlayer.getLoudnesses();

      this.uniforms = {
        volume: { type: "f", value: this.musicPlayer.getVolume() },
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
        loudness: {type: "f", value: l.total},
        baseLoudness: {type: "f", value: l.batotalse},
        frequencies: {type: "fv1", value: l.frequencies}
      }

      this.uniforms.resolution.value.x = window.innerWidth
      this.uniforms.resolution.value.y = window.innerHeight
    }

    ShaderVisualization.prototype.initScene = function(){

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(
          30 // angle
        , window.innerWidth / window.innerHeight // ratio
        , 1// near plane
        , 1000 // far plane
        )
      this.camera.position.z = 100

      // this.scene.add(this.camera)
    } 

    ShaderVisualization.prototype.addSceneObjects = function(){

        // this.geometry = new THREE.PlaneGeometry( 2, 2 );

        this.material = new THREE.ShaderMaterial( {
          uniforms: this.uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        } );

        var mesh = new THREE.Mesh( 
           // radius, detail
            new THREE.IcosahedronGeometry( 15, 4 ), 
            this.material 
        );
        this.scene.add( mesh )

    }
       
    ShaderVisualization.prototype.updateScene = function(){

      // this.uniforms.time.value += 0.05
      this.uniforms.volume.value = this.musicPlayer.getVolume()

      var l = this.musicPlayer.getLoudnesses();

      this.uniforms.baseLoudness.value = l.base
      this.uniforms.loudness.value = l.total
      this.uniforms.frequencies.value = l.frequencies

      this.uniforms.time.value = .00025 * ( Date.now() - this.startTime );
    }   


    ShaderVisualization.prototype.getGeometryVertices = function(){
      return this.geometry.vertices;
    }



// --------------------------------------
    return ShaderVisualization
  })()
  return module.exports = ShaderVisualization
})