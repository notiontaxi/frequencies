// code from http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js
varying vec2 vUv;
varying float noise;
uniform float time;
uniform float loudness;
uniform float baseLoudness;
uniform int frequencies[512];
int pos;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

  float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
  vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );

  vec3 color = vec3( vUv * ( 1. - 2. * noise * (1. - baseLoudness) ), 0.0 );
  gl_FragColor = vec4( color.rgb, 1.0 );  

/*
  // float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
  // vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );
  // vec4 color = texture2D( tExplosion, tPos );
  // vec3 color = vec3( vUv * ( 1. - 2. * noise * (1. - (volume+0.5)/2.) ), 0.0 );

  vec3 color;
    //bla = vUv.x * 512.0;
    int i = int(vUv.y * 10.);
    for (int x = 0; x <= 9; x++) {
        if (x == i){ 
            //color = vec3(  vUv * ( 1. - 2. * noise * (1. - loudness/100.) ), 0.0 );
            color = vec3(  vUv * ( 1. - 2. *  (1.0 - float(frequencies[x])) ), 0.0 );
        }
    }
    //color = vec3(  vUv * ( 1. - 2. * noise * (1. - loudness/100.) ), 0.0 );
    gl_FragColor = vec4( color.rgb, 1.0 );  

   // gl_FragColor = vec4( 80.0,80.0,80.0, 1.0 );
*/
}
    