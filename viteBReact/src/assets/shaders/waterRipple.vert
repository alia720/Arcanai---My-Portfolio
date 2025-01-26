varying vec2 vUv;
varying float wave;
uniform float time;
uniform vec2 clickPoints[10];
uniform float clickTimes[10];
uniform int numClicks;

void main() {
    vUv = uv;
    vec3 pos = position;
    wave = 0.0;
    
    for(int i = 0; i < 10; i++) {
        if(i >= numClicks) break;
        float timeSinceClick = time - clickTimes[i];
        float dist = distance(uv, clickPoints[i]);
        float ripple = (
            sin(dist * 40.0 - timeSinceClick * 4.0) * 0.5 +
            sin(dist * 30.0 - timeSinceClick * 3.0) * 0.3 +
            sin(dist * 20.0 - timeSinceClick * 2.0) * 0.2
        ) * exp(-dist * 2.0) * exp(-timeSinceClick * 0.4);
        wave += ripple;
    }
    
    pos += normal * wave * 0.4;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
