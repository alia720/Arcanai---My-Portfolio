varying vec2 vUv;
varying float wave;
uniform float time;

float hexagon(vec2 p, float radius) {
    vec2 q = abs(p);
    return max(q.x * 0.866025 + q.y * 0.5, q.y) - radius;
}

void main() {
    float clampedWave = clamp(wave, -1.0, 1.0);
    
    // Hextech colors
    vec3 deepColor = vec3(0.05, 0.0, 0.1);      // Dark purple base
    vec3 energyColor = vec3(0.7, 0.2, 0.9);     // Bright hextech purple
    vec3 glowColor = vec3(0.9, 0.4, 1.0);       // Bright magenta glow
    vec3 rippleColor = vec3(1.0, 0.2, 0.5);     // Bright pink for ripples
    
    // Energy pattern
    vec2 center = vUv - 0.5;
    float angle = atan(center.y, center.x);
    float radius = length(center);
    
    // Smooth energy effect
    float energy = sin(angle * 6.0 + time * 2.0) * 0.5 + 0.5;
    energy *= sin(radius * 10.0 - time * 3.0) * 0.5 + 0.5;
    
    // Hexagonal pattern
    vec2 hex = vUv * 8.0;
    float hexPattern = hexagon(fract(hex) - 0.5, 0.3);
    hexPattern *= hexagon(fract(hex * 0.5) - 0.5, 0.3);
    
    // Combine effects with separate ripple color
    vec3 baseEffect = mix(deepColor, energyColor, energy);
    baseEffect = mix(baseEffect, glowColor, hexPattern * energy);
    
    // Add pink ripples
    vec3 color = mix(baseEffect, rippleColor, abs(clampedWave) * 0.6);
    
    gl_FragColor = vec4(color, 1.0);
}