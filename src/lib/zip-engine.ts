import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function createZip(
  files: { name: string; data: Blob | Uint8Array | string }[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.data);
  });

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  return zipBlob;
}

export function downloadZipFile(blob: Blob, zipName = 'docuflow_archivos.zip') {
  saveAs(blob, zipName);
}
