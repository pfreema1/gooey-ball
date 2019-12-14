varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vBC;
varying float r;

uniform float scale;
uniform float power;


void main() {
    vUv = uv;
    vNormal = normalMatrix * normalize(normal);

    vec3 camWorldPos = vec3(0, 0, 5);
    vec4 posWorld = vec4(position, 1.0) * modelMatrix;
    vec4 normalWorld = vec4(vNormal, 1.0) * modelMatrix;

    vec3 i = normalize(camWorldPos - posWorld.xyz);
    vec3 n = normalWorld.xyz;
    // float scale = 0.1;
    // float power = 5.0;

    // r = max(0.0, min(1.0, pow(scale * (1.0 + i * n), power)));
    r = scale * pow(1.0 + dot(i,n), power);

    gl_Position =   projectionMatrix *
                    modelViewMatrix *
                    vec4(position,1.0);
} 