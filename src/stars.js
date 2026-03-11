export function initStars(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  const stars = [];
  const STAR_COUNT = 350;
  const BRIGHT_COUNT = 25;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const isBright = i < BRIGHT_COUNT;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBright ? 1.2 + Math.random() * 1.3 : 0.3 + Math.random() * 1.2,
        baseOpacity: 0.2 + Math.random() * 0.7,
        twinkleSpeed: 0.003 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        bright: isBright,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      star.phase += star.twinkleSpeed;
      const opacity = star.baseOpacity * (0.5 + 0.5 * Math.sin(star.phase));

      if (star.bright) {
        // Glow halo for bright stars
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 3
        );
        gradient.addColorStop(0, `rgba(200, 220, 255, ${opacity * 0.8})`);
        gradient.addColorStop(0.4, `rgba(180, 200, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}
