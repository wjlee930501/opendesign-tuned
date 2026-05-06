import { describe, expect, it } from 'vitest';
import {
  buildFigmaInsertHtml,
  buildFigmaSingleSlideHtml,
  countHtmlSlides,
} from '../../src/runtime/figma-html';

const deckHtml = `<!doctype html>
<html>
<head><style>
html,body{overflow:hidden}
.stage-outer{position:fixed}
#deck{display:flex;transform:translateX(-100%)}
.slide{width:100%;height:100%}
</style></head>
<body>
<div class="stage-outer"><div class="stage"><div id="deck">
<section class="slide dark">One</section>
<section class="slide light">Two</section>
<section class="slide dark">Three</section>
</div></div></div>
<script>document.getElementById('deck').style.transform='translateX(-100%)'</script>
</body>
</html>`;

describe('Figma HTML export transforms', () => {
  it('counts slide-shaped HTML artifacts', () => {
    expect(countHtmlSlides(deckHtml)).toBe(3);
    expect(countHtmlSlides('<main class="page">Only one page</main>')).toBe(0);
  });

  it('stacks deck slides vertically for Figma full-page import', () => {
    const out = buildFigmaInsertHtml(deckHtml);
    expect(out).toContain('od-figma-insert-overrides');
    expect(out).toContain('flex-direction: column !important');
    expect(out).toContain('width: 1280px !important');
    expect(out).toContain('height: 720px !important');
    expect(out).toContain("deck.style.transform = 'none'");
  });

  it('creates single-slide fallback files for viewport-only import tools', () => {
    const out = buildFigmaSingleSlideHtml(deckHtml, 2);
    expect(out).toContain('od-figma-single-slide-overrides');
    expect(out).toContain('translateX(-200%)');
    expect(out).toContain('width: 1280px !important');
    expect(out).toContain('height: 720px !important');
  });
});
