varying vec2 vUv;
uniform float loudness;
uniform int frequencies[512];


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
    