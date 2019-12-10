function getFragmentShader() {
  return `

    precision highp float;

    uniform sampler2D rock;
    uniform sampler2D grass;
    uniform sampler2D snow;
    uniform float snowThreshold;
    uniform float rockThreshold;

    varying vec2 vUV;
    varying vec3 incidentLight;
    varying vec3 vertexPosition;

    void main() {
      vec3 rockColor = texture2D(rock, vUV).rgb;
      vec3 grassColor = texture2D(grass, vUV).rgb;
      vec3 snowColor = texture2D(snow, vUV).rgb;
      vec3 textureColor;

      if (vertexPosition.y >= snowThreshold) {
        textureColor = snowColor;
      } else if (vertexPosition.y >= rockThreshold) {
        textureColor = rockColor;
      } else {
        textureColor = grassColor;
      }

      vec3 color = incidentLight * textureColor;

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}
