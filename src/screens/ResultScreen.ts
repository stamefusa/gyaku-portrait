import type { AppState, NavigateFn } from '../types';
import { getForegroundMask } from '../lib/maskExtract';
import { applyReversePortrait, downloadCanvas } from '../lib/blurComposite';

export function mountResult(
  container: HTMLElement,
  state: AppState,
  navigate: NavigateFn,
): void {
  container.innerHTML = `
    <div class="screen processing-screen" id="processing-view">
      <div class="spinner"></div>
      <p class="progress-label" id="progress-label">モデルを読み込み中…</p>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" id="progress-bar"></div>
      </div>
    </div>
  `;

  const progressLabel = container.querySelector<HTMLElement>('#progress-label')!;
  const progressBar = container.querySelector<HTMLElement>('#progress-bar')!;

  function setProgress(pct: number) {
    progressBar.style.width = `${pct}%`;
    if (pct < 100) {
      progressLabel.textContent = `処理中… ${pct}%`;
    } else {
      progressLabel.textContent = '仕上げ中…';
    }
  }

  const sourceCanvas = state.confirmedImage!;

  getForegroundMask(sourceCanvas, setProgress)
    .then((maskData) => {
      const resultCanvas = applyReversePortrait(sourceCanvas, maskData);
      showResult(resultCanvas);
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `
        <div class="screen processing-screen">
          <p class="error-msg">処理に失敗しました。<br/>もう一度お試しください。</p>
          <div class="btn-group" style="margin-top:1.5rem; max-width:280px;">
            <button id="btn-retry" class="btn btn-primary">最初からやり直す</button>
          </div>
        </div>
      `;
      container.querySelector('#btn-retry')!
        .addEventListener('click', () => navigate('home'));
    });

  function showResult(canvas: HTMLCanvasElement) {
    container.innerHTML = `
      <div class="screen result-screen">
        <div class="result-canvas-wrap" id="canvas-wrap"></div>
        <div class="result-controls">
          <button id="btn-cancel" class="btn btn-secondary">最初に戻る</button>
          <button id="btn-save" class="btn btn-success">保存する</button>
        </div>
      </div>
    `;

    container.querySelector('#canvas-wrap')!.appendChild(canvas);

    container.querySelector('#btn-cancel')!
      .addEventListener('click', () => navigate('home'));

    container.querySelector('#btn-save')!
      .addEventListener('click', () => downloadCanvas(canvas));
  }
}
