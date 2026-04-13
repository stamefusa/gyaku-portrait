import type { AppState, NavigateFn } from '../types';

export function mountHome(
  container: HTMLElement,
  _state: AppState,
  navigate: NavigateFn,
): void {
  container.innerHTML = `
    <div class="screen home-screen">
      <h1>逆ポートレート</h1>
      <p class="subtitle">前景をぼかして背景はシャープに</p>
      <div class="btn-group">
        <button id="btn-camera" class="btn btn-primary">📷 写真を撮る</button>
        <button id="btn-picker" class="btn btn-secondary">🖼 画像を選ぶ</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-camera')!
    .addEventListener('click', () => navigate('camera'));
  container.querySelector('#btn-picker')!
    .addEventListener('click', () => navigate('picker'));
}
