import type { AppState, NavigateFn } from '../types';

export function mountCamera(
  container: HTMLElement,
  state: AppState,
  navigate: NavigateFn,
): void {
  container.innerHTML = `
    <div class="screen camera-screen">
      <div class="camera-viewport">
        <video id="camera-video" autoplay playsinline muted></video>
        <button class="camera-back-btn" id="btn-back">✕</button>
      </div>
      <div class="camera-controls">
        <button class="shutter-btn" id="btn-shutter" disabled></button>
      </div>
    </div>
  `;

  const video = container.querySelector<HTMLVideoElement>('#camera-video')!;
  const shutterBtn = container.querySelector<HTMLButtonElement>('#btn-shutter')!;
  const backBtn = container.querySelector<HTMLButtonElement>('#btn-back')!;
  let stream: MediaStream | null = null;

  function stopStream() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  backBtn.addEventListener('click', () => {
    stopStream();
    navigate('home');
  });

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: { ideal: 'user' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
    .then((s) => {
      stream = s;
      video.srcObject = s;
      shutterBtn.disabled = false;
    })
    .catch(() => {
      container.querySelector('.camera-controls')!.innerHTML =
        '<p class="error-msg">カメラへのアクセスが許可されていません</p>';
    });

  shutterBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    // Front camera is mirrored in CSS; capture un-mirrored for natural result
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);

    const img = new Image();
    img.onload = () => {
      stopStream();
      state.pendingImage = img;
      state.previousScreen = 'camera';
      navigate('confirm');
    };
    img.src = canvas.toDataURL('image/jpeg', 0.95);
  });
}
