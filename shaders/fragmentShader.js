function getFragmentShader() {
  return `

    precision highp float;

    uniform sampler2D rock;
    uniform sampler2D grass;
    uniform sampler2D snow;

    varying vec2 vUV;
    varying vec3 incidentLight;
    varying vec3 vertexPosition;

    void main() {
      vec3 rockColor = texture2D(rock, vUV).rgb;
      vec3 grassColor = texture2D(grass, vUV).rgb;
      vec3 snowColor = texture2D(snow, vUV).rgb;
      vec3 textureColor;

      if (vertexPosition.z >= 2.25) {
        textureColor = snowColor;
      } else if (vertexPosition.z >= 1.5) {
        textureColor = rockColor;
      } else {
        textureColor = grassColor;
      }

      vec3 color = incidentLight * textureColor;

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}
