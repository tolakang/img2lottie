export interface GifExportOptions {
  width?: number
  height?: number
  fps?: number
  quality?: number
  onProgress?: (progress: number) => void
}

export async function exportToGif(
  _animationData: any,
  _options: GifExportOptions = {}
): Promise<Blob> {
  throw new Error('GIF export requires additional setup. Use Download JSON instead.')
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
