// code from http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js
varying vec2 vUv;
//varying float noise;
uniform float time;
uniform float loudness;
uniform float baseLoudness;
uniform int frequencies[512];
int pos;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {
    vec3 color;

    int i = int(vUv.y * 512.) -40;
    if(i >= 0){
      for (int x = 0; x < 512; x++) {
          if (x == i){ 
                color = vec3(  vUv * ( 1. - float(frequencies[x])/300.) , loudness );
          }
      }
      gl_FragColor = vec4( color.rgb, 1.0 ); 
    }else{
      color = vec3(  vUv  , 0.0 );
      gl_FragColor = vec4( color.rgb, 1.0 ); 
    }

}
    