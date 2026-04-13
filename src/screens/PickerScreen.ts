import type { AppState, NavigateFn } from '../types';

export function mountPicker(
  container: HTMLElement,
  state: AppState,
  navigate: NavigateFn,
): void {
  // Show minimal UI while picker is open
  container.innerHTML = `
    <div class="screen home-screen">
      <p class="subtitle">画像を選択中…</p>
    </div>
  `;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) {
      navigate('home');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.pendingImage = img;
        state.previousScreen = 'picker';
        navigate('confirm');
      };
      img.onerror = () => navigate('home');
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  // If user cancels the picker without selecting
  // Use focus event on window as a fallback for cancel detection
  const onWindowFocus = () => {
    window.removeEventListener('focus', onWindowFocus);
    setTimeout(() => {
      if (!input.files?.length) {
        navigate('home');
      }
    }, 300);
  };
  window.addEventListener('focus', onWindowFocus);

  input.click();
}
