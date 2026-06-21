export interface CompressImageOptions {
  maxSize?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

/**
 * Resize and compress an image file to a base64 data URL (WebP by default).
 */
export function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<string> {
  const { maxSize = 1024, quality = 0.8, mimeType = 'image/webp' } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      if (typeof e.target?.result === 'string') img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
