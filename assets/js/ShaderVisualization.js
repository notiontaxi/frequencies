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
        this.childInit()
      }else{
        var that = this
        setTimeout(function() {that.waitForPlayer()}, 100);
      }
    }

    ShaderVisualization.prototype.childInit = function(){
      this.startTime = Date.now()
      this.initUniforms()
      this.initialize()
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

      this.testArray = Array(1.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.0);

      var l = this.musicPlayer.getLoudnesses();

      this.uniforms = {
        volume: { type: "f", value: this.musicPlayer.getVolume() },
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
        loudness: {type: "f", value: l.total},
        baseLoudness: {type: "f", value: l.batotalse},
        frequencies: {type: "iv1", value: l.frequencies}
      }

      this.uniforms.resolution.value.x = window.innerWidth
      this.uniforms.resolution.value.y = window.innerHeight
    }

    ShaderVisualization.prototype.initRenderer = function(){

      if(!!this.canvas)
        this.canvas.remove()

      var rendererOptions = {
          antialias: true
        , 
      }

      this.renderer = new THREE.WebGLRenderer(rendererOptions)
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.canvas = this.renderer.domElement
      this.canvas.id = "the-canvas"
      this.container.append($(this.canvas))
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

      this.scene.add(this.camera)
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

      this.uniforms.loudness.value = l.total/10

      var newBaseVal = l.base - 205
      newBaseVal = newBaseVal < 1.0 ? 1.0 : newBaseVal/5.0
      newBaseVal = newBaseVal > 10.0 ? 10.0 : newBaseVal

      // console.log(newBaseVal)

      this.uniforms.baseLoudness.value = newBaseVal/2.0
      this.uniforms.loudness.value = l.total/20.0
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