"use strict";

// Progressive enhancement: page content stays visible if animation is unavailable.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector(".motion-toggle");
  const animations = new Set();
  let userPaused = false;
  const motionEnabled = () => !reducedMotion.matches && !userPaused;

  function reveal(element, delay = 0) {
    if (!motionEnabled() || !element.animate) return;
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(22px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 720,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      },
    );
    animations.add(animation);
    animation.onfinish = animation.oncancel = () =>
      animations.delete(animation);
  }

  const heroElements = document.querySelectorAll(
    ".hero-copy > .eyebrow, .hero h1, .hero-description, .hero-copy > .button, .hero-visual",
  );
  heroElements.forEach((element, index) => reveal(element, index * 75));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target, Number(entry.target.dataset.revealDelay || 0));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".about-content > *, .section-heading > *, .initiative-card, .project-card, .ideas-copy > *, .connect-heading > *, .connect-paths > *",
      )
      .forEach((element) => {
        if (
          element.matches(".initiative-card, .project-card, .connect-paths > *")
        ) {
          element.dataset.revealDelay =
            ([...element.parentElement.children].indexOf(element) % 3) * 70;
        }
        observer.observe(element);
      });
  }

  document.querySelector(".filters").addEventListener("click", (event) => {
    if (!event.target.closest("[data-filter]")) return;
    document
      .querySelectorAll(".initiative-card:not([hidden])")
      .forEach((card, index) => reveal(card, index * 45));
  });

  const field = createTopoField(
    document.querySelector(".topo-field"),
    motionEnabled,
  );
  function syncMotion() {
    document.documentElement.classList.toggle(
      "motion-paused",
      !motionEnabled(),
    );
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute("aria-pressed", String(userPaused));
    toggle.innerHTML = userPaused
      ? 'Resume motion <span aria-hidden="true">▷</span>'
      : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
    if (!motionEnabled()) animations.forEach((animation) => animation.cancel());
    field?.sync();
  }
  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    syncMotion();
  });
  reducedMotion.addEventListener("change", syncMotion);
  syncMotion();
})();

/**
 * Adapted from ThreeUI Community Topo Field, @designcodeio/threeui v1.2.0.
 * Copyright (c) 2026 Meng To. MIT; see assets/licenses/ThreeUI-MIT.txt.
 * Source: https://github.com/MengTo/threeui
 * Adaptations: transparent sage palette, bounded canvas resolution, 30 fps,
 * offscreen/tab suspension, user pause, reduced motion and context-loss fallback.
 */
function createTopoField(canvas, motionEnabled) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    canvas.hidden = true;
    return null;
  }
  const vertexSource = `
                attribute vec2 a_position;
                void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
            `;
  const fragmentSource = `
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform float u_dpr;

                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy) );
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m; m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    st.x *= u_resolution.x / u_resolution.y;

                    // 1px physical grid rendering
                    float gridSize = 48.0 * u_dpr;
                    vec2 gridSt = gl_FragCoord.xy / gridSize;
                    vec2 gridFract = fract(gridSt);
                    float lineThickness = 1.0 / gridSize;
                    float gridLines = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);
                    gridLines = clamp(gridLines, 0.0, 1.0) * 0.12; 

                    // Ultra-thin Topographic Lines
                    float noiseScale = 1.4;
                    vec2 noisePos = st * noiseScale + vec2(u_time * 0.015, u_time * 0.025);
                    float n = snoise(noisePos) * 0.5 + 0.5;
                    float numBands = 10.0;
                    float bandVal = n * numBands;
                    float triangleWave = abs(fract(bandVal) - 0.5) * 2.0; 
                    
                    // Thinner smoothstep constraint for fine industrial aesthetic
                    float topoLines = (1.0 - smoothstep(0.0, 0.045, triangleWave)) * 0.45;

                    vec3 color = vec3(0.0);
                    color += vec3(1.0) * gridLines;
                    color += vec3(1.0) * topoLines;

                    gl_FragColor = vec4(vec3(0.28, 0.37, 0.26), min(color.r, 0.65) * 0.65);
                }
            `;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    canvas.hidden = true;
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    canvas.hidden = true;
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pixelRatio = gl.getUniformLocation(program, "u_dpr");
  let frame = 0;
  let elapsed = 0;
  let previousTime = 0;
  let lastDraw = 0;
  let visible = false;
  let contextLost = false;
  function draw() {
    if (contextLost) return;
    gl.uniform1f(time, elapsed * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function resize() {
    if (contextLost) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(pixelRatio, ratio);
    draw();
  }
  function tick(timestamp) {
    elapsed += previousTime ? Math.min(timestamp - previousTime, 100) : 0;
    previousTime = timestamp;
    if (timestamp - lastDraw >= 1000 / 30) {
      draw();
      lastDraw = timestamp;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    if (motionEnabled() && visible && !document.hidden && !contextLost)
      frame = requestAnimationFrame(tick);
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }).observe(canvas);
  } else {
    visible = true;
  }
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", () => {
    contextLost = true;
    canvas.hidden = true;
    sync();
  });
  resize();
  return { sync };
}
