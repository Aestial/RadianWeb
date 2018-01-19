varying vec2 vUv;
uniform sampler2D tex;

void main() {
  vec4 color = texture2D(tex, vUv);
  gl_FragColor = vec4( color.rgb, 1.0 );
}
