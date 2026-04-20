import { createRoot, type Root } from 'react-dom/client';
import { createElement } from 'react';
import html2canvas from 'html2canvas';
import MbtiShareCardView, { type MbtiShareCardViewProps } from '../components/MbtiShareCardView';

/**
 * Render MbtiShareCardView off-screen and capture it as a canvas.
 *
 * The component is mounted inside a fixed-position wrapper kept off-screen
 * (left: -10000) so layout still computes normally but the user never sees
 * it. After html2canvas finishes, the wrapper is unmounted and removed.
 */
export async function captureMbtiShareCard(
  props: MbtiShareCardViewProps,
): Promise<HTMLCanvasElement> {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-10000px';
  wrapper.style.width = '750px';
  wrapper.style.zIndex = '-1';
  wrapper.style.pointerEvents = 'none';
  document.body.appendChild(wrapper);

  let root: Root | null = null;
  try {
    root = createRoot(wrapper);
    root.render(createElement(MbtiShareCardView, props));

    // Wait for React to commit + images (type PNG + QR) to load.
    await new Promise((r) => setTimeout(r, 120));
    const imgs = Array.from(wrapper.querySelectorAll('img'));
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((r) => {
              img.onload = () => r();
              img.onerror = () => r();
            }),
      ),
    );

    const canvas = await html2canvas(wrapper, {
      backgroundColor: '#080808',
      scale: 2,
      useCORS: true,
      logging: false,
      width: 750,
      windowWidth: 750,
    });
    return canvas;
  } finally {
    if (root) root.unmount();
    wrapper.remove();
  }
}
