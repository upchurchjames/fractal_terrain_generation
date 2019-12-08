function getVertexShader() {
  return `

    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform vec3 skyLight;
    uniform vec3 groundLight;
    uniform vec3 material;
    uniform vec3 upDirection;

    varying vec2 vUV;
    varying vec3 incidentLight;

    void main() {
      vec3 worldNormal = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
      vUV = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}
