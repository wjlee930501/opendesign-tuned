const FIGMA_INSERT_OVERRIDES = String.raw`
<style id="od-figma-insert-overrides">
  html,
  body {
    width: 1280px !important;
    min-width: 1280px !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    background: #2a2a2a !important;
  }

  .stage-outer {
    position: static !important;
    inset: auto !important;
    display: block !important;
    width: 1280px !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    background: #2a2a2a !important;
  }

  .stage {
    position: static !important;
    width: 1280px !important;
    height: auto !important;
    min-height: auto !important;
    aspect-ratio: auto !important;
    overflow: visible !important;
    background: transparent !important;
  }

  #deck {
    position: static !important;
    inset: auto !important;
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    width: 1280px !important;
    height: auto !important;
    transform: none !important;
    transition: none !important;
    will-change: auto !important;
    gap: 48px !important;
  }

  .slide {
    flex: 0 0 auto !important;
    width: 1280px !important;
    height: 720px !important;
    min-width: 1280px !important;
    min-height: 720px !important;
    max-width: 1280px !important;
    max-height: 720px !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }

  .slide,
  .slide * {
    animation: none !important;
    transition: none !important;
  }
</style>
<script id="od-figma-insert-freeze">
  (() => {
    const deck = document.getElementById('deck');
    const slides = Array.from(document.querySelectorAll('.slide'));
    if (deck) deck.style.transform = 'none';
    slides.forEach((slide) => slide.classList.add('active'));
    document.body.classList.remove('light-bg');
  })();
</script>`;

function singleSlideOverride(index: number): string {
  const offset = index * 100;
  return String.raw`
<style id="od-figma-single-slide-overrides">
  html,
  body {
    width: 1280px !important;
    height: 720px !important;
    min-width: 1280px !important;
    min-height: 720px !important;
    overflow: hidden !important;
  }
  .stage-outer {
    position: fixed !important;
    inset: 0 !important;
    display: block !important;
    width: 1280px !important;
    height: 720px !important;
    overflow: hidden !important;
  }
  .stage {
    position: absolute !important;
    inset: 0 !important;
    width: 1280px !important;
    height: 720px !important;
    aspect-ratio: auto !important;
    overflow: hidden !important;
  }
  #deck {
    position: absolute !important;
    inset: 0 !important;
    width: 1280px !important;
    height: 720px !important;
    transform: translateX(-${offset}%) !important;
    transition: none !important;
  }
  .slide {
    width: 1280px !important;
    height: 720px !important;
    min-width: 1280px !important;
    min-height: 720px !important;
    overflow: hidden !important;
  }
  .slide,
  .slide * {
    animation: none !important;
    transition: none !important;
  }
</style>
<script id="od-figma-single-slide-freeze">
  (() => {
    const deck = document.getElementById('deck');
    const slides = Array.from(document.querySelectorAll('.slide'));
    if (deck) deck.style.transform = 'translateX(-${offset}%)';
    slides.forEach((slide, i) => slide.classList.toggle('active', i === ${index}));
    const current = slides[${index}];
    if (current) {
      const theme = current.dataset.theme || (current.classList.contains('light') ? 'light' : 'dark');
      document.body.classList.toggle('light-bg', theme === 'light');
    }
  })();
</script>`;
}

function injectBeforeBodyEnd(html: string, injection: string): string {
  if (/<\/body\s*>/i.test(html)) {
    return html.replace(/<\/body\s*>/i, `${injection}\n</body>`);
  }
  return `${html}\n${injection}`;
}

export function countHtmlSlides(html: string): number {
  const matches = html.match(/class\s*=\s*["'][^"']*\bslide\b[^"']*["']/gi);
  return matches?.length ?? 0;
}

export function buildFigmaInsertHtml(html: string): string {
  if (countHtmlSlides(html) <= 1) return html;
  return injectBeforeBodyEnd(html, FIGMA_INSERT_OVERRIDES);
}

export function buildFigmaSingleSlideHtml(html: string, index: number): string {
  return injectBeforeBodyEnd(html, singleSlideOverride(index));
}
