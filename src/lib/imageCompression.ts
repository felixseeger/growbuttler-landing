/**
 * Compress an image file to reduce size before upload
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Promise<File> - Compressed image file
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = reject

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height

        if (width > height) {
          width = maxWidth
          height = maxWidth / aspectRatio
        } else {
          height = maxHeight
          width = maxHeight * aspectRatio
        }
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          // Create a new File from the blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = reject

    reader.readAsDataURL(file)
  })
}

/**
 * Get the size reduction percentage
 */
export function getSizeReduction(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
