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