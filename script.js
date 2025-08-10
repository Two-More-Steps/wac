const logoUrl = "https://two-more-steps.github.io/wac/logo.svg";
const wacUrl = "https://academics.cu.ac.kr/home/detail/design/dcuwac/";

function updateLogoAndLink(selector) {
  const anchor = document.querySelector(selector);
  if (!anchor) return;
  anchor.href = wacUrl;
  const img = anchor.querySelector('img');
  if (img) img.src = logoUrl;
}

updateLogoAndLink(".wrap_m_m > a");
updateLogoAndLink("#header > a");

document.querySelectorAll('section#activity .row .item a').forEach(el => {
  el.textContent = 'View more';
});

const newElement = document.createElement('div');
newElement.innerHTML = `
<div class="tms-floatingbar-containers">
  <div class="tms-floatingbar-container">
    <div class="tms-floatingbar">
      <div class="tms-floatingbar-content">
        <span class="italic">WAC - Webtoon Anime Creation.</span> 
        <span class="bold">WAC - Webtoon Anime Creation.</span> 
        <span>WAC - Webtoon Anime Creation.</span>
      </div>
    </div>
  </div>
  <div class="tms-floatingbar-container2">
    <div class="tms-floatingbar2">
      <div class="tms-floatingbar-content2">
        <span class="italic">WAC - Webtoon Anime Creation.</span> 
        <span class="bold">WAC - Webtoon Anime Creation.</span> 
        <span>WAC - Webtoon Anime Creation.</span>
      </div>
    </div>
  </div>
</div>
`;

const oldElement = document.querySelector('#introduction');
if (oldElement) {
  oldElement.replaceWith(newElement);
}

function setupMarquee(selector, animationName) {
  const container = document.querySelector(selector);
  const content = container.querySelector('div');
  container.innerHTML = '';
  const clone = content.cloneNode(true);
  const clone2 = content.cloneNode(true);
  container.appendChild(content);
  container.appendChild(clone);
  container.appendChild(clone2);
  const contentWidth = content.offsetWidth;
  const duration = (contentWidth / 100) * 2;
  content.style.animationDuration = `${duration}s`;
  clone.style.animationDuration = `${duration}s`;
  clone2.style.animationDuration = `${duration}s`;
  content.style.animationName = animationName;
  clone.style.animationName = animationName;
  clone2.style.animationName = animationName;
  requestAnimationFrame(() => {
    container.style.visibility = 'visible';
  });
}

window.addEventListener('load', function () {
  setupMarquee('.tms-floatingbar', 'marquee');
  setupMarquee('.tms-floatingbar2', 'marquee2');
});

window.addEventListener('resize', function () {
  setupMarquee('.tms-floatingbar', 'marquee');
  setupMarquee('.tms-floatingbar2', 'marquee2');
});

const linkEl = document.createElement('link');
linkEl.rel = 'stylesheet';
linkEl.href = 'https://two-more-steps.github.io/wac/styles.css';
document.head.appendChild(linkEl);

window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

function updateBodyPadding() {
  const header = document.querySelector('#header');
  if (!header) return;
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = `${headerHeight}px`;
}

window.addEventListener('load', updateBodyPadding);
window.addEventListener('resize', updateBodyPadding);

function enableGraffitiCursorEffect() {
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
  if (!document.getElementById('graffiti-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'graffiti-cursor-style';
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);
  }
  const canvas = document.createElement('canvas');
  canvas.id = 'graffitiCanvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let devicePixelRatio = window.devicePixelRatio || 1;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  resizeCanvas();

  let mousePos = { x: 0, y: 0 };
  let lastParticleTime = 0;
  let lastFrameTime = 0;
  let hoverPointerElement = false;
  let isAnimating = true;

  const PARTICLE_LIFETIME = 150;
  const PARTICLE_INTERVAL = 16;
  const PARTICLE_COUNT = 20;
  const MAX_PARTICLES = 300;
  const palette = ['#FF0033', '#FFD700', '#0055FF', '#FF00AA', '#00CFFF', '#FFFFFF'];

  const particlePool = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particlePool.push({ x: 0, y: 0, radius: 0, alpha: 0, life: 0, startTime: 0, color: '', active: false });
  }

  function getPooledParticle() {
    for (let i = 0; i < particlePool.length; i++) {
      if (!particlePool[i].active) {
        return particlePool[i];
      }
    }
    return null;
  }

  function addParticles(pos, currentTime) {
    const isHover = hoverPointerElement;
    const count = isHover ? Math.floor(PARTICLE_COUNT * 0.7) : PARTICLE_COUNT;
    for (let i = 0; i < count; i++) {
      const particle = getPooledParticle();
      if (!particle) break;
      const angle = Math.random() * 6.28318;
      const distance = isHover ? (1 + Math.random()) * 24 : Math.pow(Math.random(), 2) * 12;
      const radius = isHover ? (Math.random() * 1.5 + 2) : (Math.random() * 1.5 + 0.5);
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      particle.x = pos.x + offsetX;
      particle.y = pos.y + offsetY;
      particle.radius = radius;
      particle.startTime = currentTime;
      particle.color = palette[Math.floor(Math.random() * palette.length)];
      particle.active = true;
    }
  }

  function paint(currentTime) {
    if (!isAnimating) return;
    if (currentTime - lastFrameTime < 16.67) {
      requestAnimationFrame(paint);
      return;
    }
    lastFrameTime = currentTime;
    ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
    let activeParticles = 0;
    for (let i = 0; i < particlePool.length; i++) {
      const p = particlePool[i];
      if (!p.active) continue;
      const age = currentTime - p.startTime;
      if (age > PARTICLE_LIFETIME) {
        p.active = false;
        continue;
      }
      activeParticles++;
      const alpha = 1 - (age / PARTICLE_LIFETIME);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 6.28318);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (activeParticles === 0 && currentTime - lastParticleTime > 100) {
      setTimeout(() => requestAnimationFrame(paint), 50);
    } else {
      requestAnimationFrame(paint);
    }
  }

  function update(currentTime) {
    if (currentTime - lastParticleTime > PARTICLE_INTERVAL) {
      addParticles(mousePos, currentTime);
      lastParticleTime = currentTime;
    }
    requestAnimationFrame(update);
  }

  let mouseMoveTimeout;
  function handleMouseMove(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    if (mouseMoveTimeout) return;
    mouseMoveTimeout = setTimeout(() => {
      const el = document.elementFromPoint(mousePos.x, mousePos.y);
      if (el) {
        const computedStyle = window.getComputedStyle(el);
        const pointerLike = computedStyle.cursor === 'pointer' || el.closest('a, button, [role="button"], input, select, textarea');
        hoverPointerElement = !!pointerLike;
      }
      mouseMoveTimeout = null;
    }, 10);
  }

  let resizeTimeout;
  function handleResize() {
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      resizeTimeout = null;
    }, 100);
  }

  function handleVisibilityChange() {
    isAnimating = !document.hidden;
    if (isAnimating) {
      requestAnimationFrame(paint);
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  requestAnimationFrame(paint);
  requestAnimationFrame(update);

  return function cleanup() {
    isAnimating = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    canvas.remove();
    const style = document.getElementById('graffiti-cursor-style');
    if (style) style.remove();
  };
}

enableGraffitiCursorEffect();
