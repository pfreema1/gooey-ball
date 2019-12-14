varying vec2 vUv;
varying mediump vec3 vNormal;
varying float r;

void main() {
    vec3 view_nv = normalize(vNormal);
    vec3 nv_color = view_nv * 0.5 + 0.5;

    nv_color = mix(nv_color, vec3(0.0, 0.0, 0.0), 1.0 - r);

    gl_FragColor = vec4(nv_color, 1.0);
}