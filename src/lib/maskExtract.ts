import { removeBackground } from '@imgly/background-removal';

export async function getForegroundMask(
  sourceCanvas: HTMLCanvasElement,
  onProgress?: (pct: number) => void,
): Promise<ImageData> {
  // The library does not accept HTMLCanvasElement; convert to Blob first
  const inputBlob = await new Promise<Blob>((resolve, reject) => {
    sourceCanvas.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
  });

  const maskBlob = await removeBackground(inputBlob, {
    model: 'isnet_fp16',
    output: {
      format: 'image/png',
      type: 'mask',
    },
    progress: (_key: string, current: number, total: number) => {
      if (onProgress && total > 0) {
        onProgress(Math.round((current / total) * 100));
      }
    },
  });

  const url = URL.createObjectURL(maskBlob);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  URL.revokeObjectURL(url);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
