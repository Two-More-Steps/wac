const logoUrl = "https://two-more-steps.github.io/wac/logo.svg";
const wacUrl = "https://academics.cu.ac.kr/home/detail/design/dcuwac/";

// 공통 처리 함수
function updateLogoAndLink(selector) {
  const anchor = document.querySelector(selector);
  if (!anchor) return;
  anchor.href = wacUrl;
  const img = anchor.querySelector('img');
  if (img) img.src = logoUrl;
}

// 대상 링크들에 대해 반복 적용
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

  // Clear previous content
  container.innerHTML = '';

  // Clone the content
  const clone = content.cloneNode(true);
  const clone2 = content.cloneNode(true);

  // Add original and cloned content
  container.appendChild(content);
  container.appendChild(clone);
  container.appendChild(clone2);

  // Adjust animation duration based on content width
  const contentWidth = content.offsetWidth;
  const duration = (contentWidth / 100) * 2; // 속도를 더 높이기 위해 계수를 조정

  content.style.animationDuration = `${duration}s`;
  clone.style.animationDuration = `${duration}s`;
  clone2.style.animationDuration = `${duration}s`;

  // 애니메이션 이름 설정
  content.style.animationName = animationName;
  clone.style.animationName = animationName;
  clone2.style.animationName = animationName;

  // 브라우저의 페인트 사이클에 맞춰 요소를 표시
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
// linkEl.href = 'http://127.0.0.1:5500/styles.css';


// head의 마지막 자식으로 삽입
document.head.appendChild(linkEl);



window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100); // 1000ms = 1초
});


function updateBodyPadding() {
  const header = document.querySelector('#header');
  if (!header) return;
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = `${headerHeight}px`;
}

// 페이지 로드 후 적용
window.addEventListener('load', updateBodyPadding);

// 리사이즈 시에도 다시 계산
window.addEventListener('resize', updateBodyPadding);


function enableGraffitiCursorEffect() {
  // ✅ 모바일 환경에서는 작동하지 않음
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;

  // ✅ 모든 요소 커서 숨김
  const style = document.createElement('style');
  style.innerHTML = `* { cursor: none !important; }`;
  document.head.appendChild(style);

  // ✅ 캔버스 생성
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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let mousePos = { x: 0, y: 0 };
  let particles = [];
  let lastTimestamp = 0;
  let hoverPointerElement = false;

  const PARTICLE_LIFETIME = 0.15;
  const PARTICLE_DECAY = 1.0 / (PARTICLE_LIFETIME * 60);
  const PARTICLE_INTERVAL = 12;
  const PARTICLE_COUNT = 30;

  // 🎨 팝아트 스타일 팔레트
  const palette = ['#FF0033', '#FFD700', '#0055FF', '#FF00AA', '#00CFFF', '#FFFFFF'];

  function setPosition(e) {
    return {
      x: e.clientX || 0,
      y: e.clientY || 0
    };
  }

  function addParticles(pos) {
    const scale = 1;
    const count = hoverPointerElement ? PARTICLE_COUNT * 0.5 : PARTICLE_COUNT;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;

      // 중심 비우기: hover 시에만
      const distance = hoverPointerElement
        ? (0.4 + Math.pow(Math.random(), 2) * 0.6) * 16
        : Math.pow(Math.random(), 2) * 16;

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      particles.push({
        x: pos.x + offsetX,
        y: pos.y + offsetY,
        radius: (Math.random() * 2 + 0.5) * scale,
        alpha: 1.0,
        life: 1.0,
        decay: PARTICLE_DECAY
      });
    }
  }

  function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p, index) => {
      p.life -= p.decay;
      if (p.life <= 0) return false;

      const color = palette[index % palette.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 0;
      ctx.fill();
      return true;
    });
    requestAnimationFrame(paint);
  }

  function update(timestamp) {
    if (timestamp - lastTimestamp > PARTICLE_INTERVAL) {
      addParticles(mousePos);
      lastTimestamp = timestamp;
    }
    requestAnimationFrame(update);
  }

  function handleMouseMove(e) {
    mousePos = setPosition(e);

    const el = document.elementFromPoint(mousePos.x, mousePos.y);
    const pointerLike =
      getComputedStyle(el).cursor === 'pointer' ||
      el.closest('a, button, [role="button"]');

    hoverPointerElement = !!pointerLike;
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  paint();
  requestAnimationFrame(update);
}

enableGraffitiCursorEffect();
