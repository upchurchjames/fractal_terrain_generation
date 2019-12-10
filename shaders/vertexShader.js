function getVertexShader() {
  return `

    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;

    uniform vec3 up;
    uniform vec3 skyLight;

    varying vec2 vUV;
    varying vec3 incidentLight;
    varying vec3 vertexPosition;
    varying vec4 viewSpace;

    void main() {
      vec3 worldNormal = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
      vUV = uv;

      viewSpace = viewMatrix * modelMatrix * vec4(position, 1.0);

      float w = 0.5 * (1.0 + dot(up, worldNormal));

      incidentLight = w * skyLight;
      vertexPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}
