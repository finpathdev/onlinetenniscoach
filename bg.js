/* Court backdrop: drifting lines, a soft mesh, and a few tennis balls.
   Pauses when the tab is hidden. Draws a single frame when the user
   prefers reduced motion. */
(function () {
  const canvas = document.getElementById("rippleBg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  canvas.setAttribute("aria-hidden", "true");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const balls = [
    { x: 0.05, y: 0.18, r: 9, speed: 0.016, phase: 0.2, depth: 0.7 },
    { x: 0.95, y: 0.28, r: 12, speed: 0.012, phase: 1.4, depth: 0.9 },
    { x: 0.07, y: 0.78, r: 8, speed: 0.02, phase: 2.2, depth: 0.55 },
    { x: 0.93, y: 0.84, r: 14, speed: 0.01, phase: 0.8, depth: 0.8 },
    { x: 0.04, y: 0.48, r: 7, speed: 0.018, phase: 2.8, depth: 0.45 }
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let running = true;
  const pointer = { x: 0.5, y: 0.4 };
  const offset = { x: 0, y: 0 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  }

  function ball(x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.15, 0, 0, r);
    g.addColorStop(0, "#fff6b5");
    g.addColorStop(0.55, "#e4cf55");
    g.addColorStop(1, "#a8922e");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(48, 72, 24, 0.7)";
    ctx.lineWidth = Math.max(1, r * 0.09);
    ctx.beginPath();
    ctx.arc(-r * 0.2, 0, r * 0.92, -1.05, 1.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r * 0.2, 0, r * 0.92, Math.PI - 1.05, Math.PI + 1.05);
    ctx.stroke();
    ctx.restore();
  }

  function draw(time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    offset.x += ((pointer.x - 0.5) * 26 - offset.x) * 0.04;
    offset.y += ((pointer.y - 0.4) * 16 - offset.y) * 0.04;
    const drift = reduce.matches ? 0 : Math.sin(time * 0.00012) * 20;

    const mesh = [
      { x: width * 0.2 + offset.x, y: height * 0.15, c: "rgba(28, 90, 52, 0.45)", r: width * 0.45 },
      { x: width * 0.85, y: height * 0.2 + offset.y, c: "rgba(214, 239, 74, 0.07)", r: width * 0.32 },
      { x: width * 0.55, y: height * 0.95, c: "rgba(16, 50, 32, 0.55)", r: width * 0.5 }
    ];
    mesh.forEach(m => {
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      g.addColorStop(0, m.c);
      g.addColorStop(1, "rgba(7, 17, 12, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    });

    ctx.save();
    ctx.translate(width * 0.5 + drift * 0.4 + offset.x, height * 0.98 + offset.y);
    ctx.strokeStyle = "rgba(214, 239, 74, 0.11)";
    ctx.lineWidth = 1.15;
    const rows = 7;
    for (let i = 0; i < rows; i++) {
      const p = i / (rows - 1);
      const y = -height * 0.22 + p * height * 0.48;
      const half = 40 + p * Math.min(width, 1100) * 0.46;
      ctx.globalAlpha = 0.35 + p * 0.65;
      ctx.beginPath();
      ctx.moveTo(-half, y);
      ctx.lineTo(half, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(-46, -height * 0.22);
    ctx.lineTo(-Math.min(width, 1100) * 0.42, height * 0.26);
    ctx.moveTo(46, -height * 0.22);
    ctx.lineTo(Math.min(width, 1100) * 0.42, height * 0.26);
    ctx.moveTo(0, -height * 0.22);
    ctx.lineTo(0, height * 0.26);
    ctx.stroke();
    ctx.restore();

    balls.forEach(b => {
      const travel = reduce.matches ? b.y : (b.y + time * 0.00001 * b.speed * 40) % 1;
      const x = b.x * width + Math.sin(time * 0.00035 * (1 + b.depth) + b.phase) * 10 + offset.x * b.depth * 0.4;
      const y = travel * (height + 40) - 20;
      const radius = b.r * (0.75 + b.depth * 0.45);
      ball(x, y, radius, time * 0.0003 * b.speed + b.phase);
    });

    const vignette = ctx.createRadialGradient(width * 0.5, height * 0.35, width * 0.2, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
    vignette.addColorStop(0, "rgba(7, 17, 12, 0)");
    vignette.addColorStop(1, "rgba(7, 17, 12, 0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function loop(time) {
    if (!running) return;
    draw(time || 0);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (reduce.matches) {
      draw(0);
      return;
    }
    running = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  window.addEventListener("resize", () => { resize(); if (reduce.matches) draw(0); });
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX / Math.max(1, width);
    pointer.y = e.clientY / Math.max(1, height);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  if (reduce.addEventListener) {
    reduce.addEventListener("change", () => { stop(); start(); });
  }

  resize();
  start();
})();
