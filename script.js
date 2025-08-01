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
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userUser)) return;

  // ✅ 모든 요소 커서 완전 숨김 (한 번만 실행)
  if (!document.getElementById('graffiti-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'graffiti-cursor-style';
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);
  }

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
  let devicePixelRatio = window.devicePixelRatio || 1;

  // 캔버스 크기 설정 함수
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  resizeCanvas();

  // 상태 변수들
  let mousePos = { x: 0, y: 0 };
  let particles = [];
  let lastParticleTime = 0;
  let lastFrameTime = 0;
  let hoverPointerElement = false;
  let isAnimating = true;

  // 성능 최적화 상수
  const PARTICLE_LIFETIME = 150; // ms로 변경
  const PARTICLE_INTERVAL = 16;  // ~60fps
  const PARTICLE_COUNT = 20;     // 파티클 수 감소
  const MAX_PARTICLES = 300;     // 최대 파티클 수 제한

  // 🎨 팝아트 색감 팔레트 (미리 컴파일된 색상)
  const palette = ['#FF0033', '#FFD700', '#0055FF', '#FF00AA', '#00CFFF', '#FFFFFF'];

  // 오브젝트 풀링을 위한 파티클 풀
  const particlePool = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particlePool.push({
      x: 0, y: 0, radius: 0, alpha: 0, life: 0,
      startTime: 0, color: '', active: false
    });
  }

  function getPooledParticle() {
    for (let i = 0; i < particlePool.length; i++) {
      if (!particlePool[i].active) {
        return particlePool[i];
      }
    }
    return null; // 풀이 가득 찬 경우
  }

  function addParticles(pos, currentTime) {
    const isHover = hoverPointerElement;
    const count = isHover ? Math.floor(PARTICLE_COUNT * 0.7) : PARTICLE_COUNT;

    for (let i = 0; i < count; i++) {
      const particle = getPooledParticle();
      if (!particle) break; // 풀이 가득 찬 경우 중단

      const angle = Math.random() * 6.28318; // 2 * Math.PI 미리 계산
      const distance = isHover
        ? (1 + Math.random()) * 24        // 살짝 줄임
        : Math.pow(Math.random(), 2) * 12; // 살짝 줄임
      const radius = isHover
        ? (Math.random() * 1.5 + 2)       // 살짝 줄임
        : (Math.random() * 1.5 + 0.5);    // 살짝 줄임

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      // 파티클 초기화
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

    // FPS 제한 (60fps)
    if (currentTime - lastFrameTime < 16.67) {
      requestAnimationFrame(paint);
      return;
    }
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);

    let activeParticles = 0;

    // 파티클 렌더링 및 수명 관리
    for (let i = 0; i < particlePool.length; i++) {
      const p = particlePool[i];
      if (!p.active) continue;

      const age = currentTime - p.startTime;
      if (age > PARTICLE_LIFETIME) {
        p.active = false; // 파티클 비활성화
        continue;
      }

      activeParticles++;

      // 알파 계산 (수명에 따른 페이드아웃)
      const alpha = 1 - (age / PARTICLE_LIFETIME);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 6.28318); // 2 * Math.PI 미리 계산
      ctx.fill();
    }

    ctx.globalAlpha = 1; // 알파 리셋

    // 활성 파티클이 없으면 애니메이션 일시 정지
    if (activeParticles === 0 && currentTime - lastParticleTime > 100) {
      // 100ms 후에도 파티클이 없으면 잠시 대기
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

  // 쓰로틀링된 마우스 이벤트 핸들러
  let mouseMoveTimeout;
  function handleMouseMove(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    // 호버 상태 확인을 쓰로틀링
    if (mouseMoveTimeout) return;
    mouseMoveTimeout = setTimeout(() => {
      const el = document.elementFromPoint(mousePos.x, mousePos.y);
      if (el) {
        const computedStyle = window.getComputedStyle(el);
        const pointerLike = computedStyle.cursor === 'pointer' ||
          el.closest('a, button, [role="button"], input, select, textarea');
        hoverPointerElement = !!pointerLike;
      }
      mouseMoveTimeout = null;
    }, 10);
  }

  // 리사이즈 이벤트 쓰로틀링
  let resizeTimeout;
  function handleResize() {
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      resizeTimeout = null;
    }, 100);
  }

  // 페이지 가시성 API로 성능 최적화
  function handleVisibilityChange() {
    isAnimating = !document.hidden;
    if (isAnimating) {
      requestAnimationFrame(paint);
      requestAnimationFrame(update);
    }
  }

  // 이벤트 리스너 등록
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // ⏯️ 시작
  requestAnimationFrame(paint);
  requestAnimationFrame(update);

  // 정리 함수 반환
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