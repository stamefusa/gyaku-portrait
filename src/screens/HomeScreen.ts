import type { AppState, NavigateFn } from '../types';

export function mountHome(
  container: HTMLElement,
  _state: AppState,
  navigate: NavigateFn,
): void {
  container.innerHTML = `
    <div class="screen home-screen">
      <h1>逆ポートレート</h1>
      <div class="btn-group">
        <button id="btn-camera" class="btn btn-primary">写真撮影</button>
        <button id="btn-picker" class="btn btn-secondary">画像選択</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-camera')!
    .addEventListener('click', () => navigate('camera'));
  container.querySelector('#btn-picker')!
    .addEventListener('click', () => navigate('picker'));
}
