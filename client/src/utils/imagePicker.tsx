type ImagePickerResult = {
  base64: string;
  fileName: string;
};

const MAX_OUTPUT_BYTES = 4 * 1024 * 1024; // 4MB after compression
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const compressToJpeg = async (dataUrl: string): Promise<string> => {
  const img = await loadImageElement(dataUrl);
  const canvas = document.createElement("canvas");
  const ratio = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const targetWidth = Math.round(img.width * ratio);
  const targetHeight = Math.round(img.height * ratio);
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
};

const imagePicker = (e: any): Promise<ImagePickerResult> => {
  e.preventDefault();
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    let fileName = file.name;

    if (!file) {
      reject("No file selected");
    }

    reader.readAsDataURL(file);

    reader.onload = (e: any) => {
      const originalDataUrl = e.target.result as string;

      const resolveWithData = (dataUrl: string) => {
        const bytes = Math.ceil((dataUrl.length * 3) / 4); // rough base64 -> bytes
        if (bytes > MAX_OUTPUT_BYTES) {
          reject(`Image is too large after compression (${Math.round(bytes / 1024 / 1024)}MB). Please choose a smaller image.`);
          return;
        }
        resolve({
          fileName,
          base64: dataUrl
        });
      };

      compressToJpeg(originalDataUrl)
        .then(resolveWithData)
        .catch(() => resolveWithData(originalDataUrl)); // fallback to original if compression fails
    };

    reader.onerror = reject;
  });
};

export default imagePicker;
