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
    vec3 refractVec1 = refract(vec3(0.0, 0.0, 1.0), normal, 0.05) * refractAtten;
    vec3 refractVec2 = refract(vec3(0.7, 0.0, 1.0), normal, 0.05) * refractAtten;
    vec3 refractVec3 = refract(vec3(-0.7, 0.0, 1.0), normal, 0.05) * refractAtten;
    vec4 refractColor1 = texture2D(uTextCanvas, uv + refractVec1.xy);
    vec4 refractColor2 = texture2D(uTextCanvas, uv + refractVec2.xy);
    vec4 refractColor3 = texture2D(uTextCanvas, uv + refractVec3.xy);

    vec4 chromAberrColor = vec4(refractColor1.r, refractColor2.g, refractColor3.b, 1.0);

    // separate out the background and the textcanvas 
    color = mix(normalColor, chromAberrColor, step(0.01, normalColor.r));

    // mix in a little shading
    color = mix(normalColor, color, normalColor.b);

    gl_FragColor = vec4(color);
}