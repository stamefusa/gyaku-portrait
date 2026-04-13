import type { AppState, NavigateFn } from '../types';
import { resizeImageToCanvas } from '../lib/imageResize';

export function mountConfirm(
  container: HTMLElement,
  state: AppState,
  navigate: NavigateFn,
): void {
  const img = state.pendingImage!;

  container.innerHTML = `
    <div class="screen confirm-screen">
      <div class="confirm-image-wrap">
        <img id="confirm-img" src="${img.src}" alt="確認画像" />
      </div>
      <div class="confirm-controls">
        <button id="btn-cancel" class="btn btn-secondary">キャンセル</button>
        <button id="btn-ok" class="btn btn-primary">OK</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-cancel')!.addEventListener('click', () => {
    navigate(state.previousScreen ?? 'home');
  });

  container.querySelector('#btn-ok')!.addEventListener('click', () => {
    state.confirmedImage = resizeImageToCanvas(img);
    navigate('result');
  });
}
