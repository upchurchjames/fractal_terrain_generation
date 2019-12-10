function getFragmentShader() {
  return `

    precision highp float;

    uniform sampler2D rock;
    uniform sampler2D grass;
    uniform sampler2D snow;
    uniform float snowThreshold;
    uniform float rockThreshold;
    uniform vec3 skyLight;

    varying vec2 vUV;
    varying vec3 incidentLight;
    varying vec3 vertexPosition;
    varying vec4 viewSpace;

    void main() {
      vec3 rockColor = texture2D(rock, vUV).rgb;
      vec3 grassColor = texture2D(grass, vUV).rgb;
      vec3 snowColor = texture2D(snow, vUV).rgb;
      vec3 textureColor;
      float fogFactor;
      float fogDensity = 0.05;
      float dist;

      if (vertexPosition.y >= snowThreshold) {
        textureColor = snowColor;
      } else if (vertexPosition.y >= rockThreshold) {
        textureColor = rockColor;
      } else {
        textureColor = grassColor;
      }

      dist = abs(viewSpace.z);

      fogFactor = 1.0 / exp(dist * fogDensity);
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      vec3 color = mix(skyLight, incidentLight * textureColor, fogFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}
