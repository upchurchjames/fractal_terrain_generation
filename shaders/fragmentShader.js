precision highp float;

uniform sampler2D concrete;

varying vec2 vUV;
varying vec3 incidentLight;

void main() {
  vec3 concreteColor = texture2D(concrete, vUV).rgb;

  vec3 color = incidentLight * concreteColor;

  gl_FragColor = vec4(color, 1.0);
}
