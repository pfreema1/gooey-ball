precision highp float;
uniform sampler2D uScene;
uniform sampler2D uTextCanvas;
uniform sampler2D uBlobTexture;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec4 color = texture2D(uScene, uv);
    vec4 textCanvasColor = texture2D(uTextCanvas, uv);
    vec4 normalColor = texture2D(uBlobTexture, uv);
    vec3 normal = normalize(normalColor.rgb * 2.0 - 1.0);

    // only show normalColor
    // vec4 foo = mix(normalColor, textCanvasColor, normal.r);
    // color = foo;

    // create refraction of textCanvas using normal
    float refractAtten = 0.06;
    vec3 refractVec = refract(vec3(0.0, 0.0, 1.0), normal, 0.05) * refractAtten;
    vec4 refractColor = texture2D(uTextCanvas, uv + refractVec.xy);

    // if normalColor is black, just return the normalColor and not the refractColor
    color = mix(normalColor, refractColor, normalColor.r);

    gl_FragColor = vec4(color);
}