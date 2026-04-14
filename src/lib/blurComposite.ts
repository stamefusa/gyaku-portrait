const BLUR_RADIUS = 8;

export function applyReversePortrait(
  sourceCanvas: HTMLCanvasElement,
  maskData: ImageData,
): HTMLCanvasElement {
  const { width, height } = sourceCanvas;

  // Ensure mask dimensions match source; rescale if needed
  let mask = maskData;
  if (maskData.width !== width || maskData.height !== height) {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = maskData.width;
    tmpCanvas.height = maskData.height;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    tmpCtx.putImageData(maskData, 0, 0);

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = width;
    scaledCanvas.height = height;
    const scaledCtx = scaledCanvas.getContext('2d')!;
    scaledCtx.drawImage(tmpCanvas, 0, 0, width, height);
    mask = scaledCtx.getImageData(0, 0, width, height);
  }

  // Sharp layer — original pixels
  const sharpCanvas = document.createElement('canvas');
  sharpCanvas.width = width;
  sharpCanvas.height = height;
  const sharpCtx = sharpCanvas.getContext('2d')!;
  sharpCtx.drawImage(sourceCanvas, 0, 0);
  const sharpData = sharpCtx.getImageData(0, 0, width, height);

  // Blur layer — CSS filter blur
  const blurCanvas = document.createElement('canvas');
  // Add padding to avoid dark edges from blur bleeding at image borders
  const pad = BLUR_RADIUS * 2;
  blurCanvas.width = width + pad * 2;
  blurCanvas.height = height + pad * 2;
  const blurCtx = blurCanvas.getContext('2d')!;
  blurCtx.filter = `blur(${BLUR_RADIUS}px)`;
  blurCtx.drawImage(sourceCanvas, pad, pad);
  blurCtx.filter = 'none';
  // Crop back to original size
  const blurData = blurCtx.getImageData(pad, pad, width, height);

  // Composite: blend sharp + blurred using mask alpha
  const output = document.createElement('canvas');
  output.width = width;
  output.height = height;
  const outCtx = output.getContext('2d')!;
  const compositeData = outCtx.createImageData(width, height);

  const sp = sharpData.data;
  const bp = blurData.data;
  const mp = mask.data;
  const op = compositeData.data;
  const len = width * height;

  for (let i = 0; i < len; i++) {
    const idx = i * 4;
    // mask alpha: 255 = foreground (blur), 0 = background (sharp)
    const t = mp[idx + 3] / 255;
    op[idx]     = bp[idx]     * t + sp[idx]     * (1 - t);
    op[idx + 1] = bp[idx + 1] * t + sp[idx + 1] * (1 - t);
    op[idx + 2] = bp[idx + 2] * t + sp[idx + 2] * (1 - t);
    op[idx + 3] = 255;
  }

  outCtx.putImageData(compositeData, 0, 0);
  return output;
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename = 'gyaku-portrait.jpg',
): void {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    'image/jpeg',
    0.92,
  );
}
