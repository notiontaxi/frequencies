varying vec2 vUv;
uniform float loudness;
uniform float frequencies[128];

void main() {
    vec3 color;

    int i = int(vUv.y * 128.) ;
    if(i >= 0){
      for (int x = 0; x < 128; x++) {
          if (x == i){ 
                color = vec3(  vUv * (.3 + frequencies[x]) , loudness );
                //color = vec3(  vUv  , 0.0 );
          }
      }
      gl_FragColor = vec4( color.rgb, 1.0 ); 
    }else{
      color = vec3(  vUv  , 0.0 );
      gl_FragColor = vec4( color.rgb, 1.0 ); 
    }

}
    