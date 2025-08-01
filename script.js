const logoUrl = "https://two-more-steps.github.io/wac/logo.svg";
const wacUrl = "https://academics.cu.ac.kr/home/detail/design/dcuwac/";

const link = document.querySelector(".wrap_m_m > a");
if (link) {
  link.href = wacUrl;
  const img = link.querySelector("img");
  if (img) {
    img.src = logoUrl;
  }
}

document.querySelectorAll('section#activity .row .item a').forEach(el => {
  el.textContent = 'View more';
});


const newElement = document.createElement('div');
newElement.innerHTML = `
<div class="tms-floatingbar-containers">
  <div class="tms-floatingbar-container">
	<div class="tms-floatingbar">
	  <div class="tms-floatingbar-content">
		<span class="italic">Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span> 
		<span class="bold">Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span> 
		<span>Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span>
	  </div>
	</div>
  </div>

  <div class="tms-floatingbar-container2">
	<div class="tms-floatingbar2">
	  <div class="tms-floatingbar-content2">
		<span class="italic">Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span> 
		<span class="bold">Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span> 
		<span>Imagination that crosses boundaries, stories that move the frame. Webtoon Anime Creation.</span>
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