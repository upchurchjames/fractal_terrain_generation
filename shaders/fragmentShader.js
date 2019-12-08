function getFragmentShader() {
  return `

    precision highp float;

    uniform sampler2D rock;

    varying vec2 vUV;
    varying vec3 incidentLight;

    void main() {
      vec3 rockColor = texture2D(rock, vUV).rgb;

      vec3 color = incidentLight * rockColor;

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}
