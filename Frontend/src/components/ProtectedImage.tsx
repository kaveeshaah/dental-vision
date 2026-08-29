import { useState, useEffect } from 'react'
import { getScanImage } from '../api'

interface ProtectedImageProps {
  imageId: string | null
  alt: string
  className?: string
}

export default function ProtectedImage({ imageId, alt, className = '' }: ProtectedImageProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchImage() {
      if (!imageId) {
        setImgUrl('/xray-image.png') // Fallback to default if no ID
        setLoading(false)
        return
      }

      try {
        const url = await getScanImage(imageId)
        if (active) {
          setImgUrl(url)
        }
      } catch (err) {
        if (active) {
          // If fetching fails (e.g. image wasn't saved in older reports), fallback
          setImgUrl('/xray-image.png')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchImage()

    return () => {
      active = false
      if (imgUrl && imgUrl !== '/xray-image.png') {
        URL.revokeObjectURL(imgUrl)
      }
    }
  }, [imageId])

  if (loading) {
    return <div className={`animate-pulse bg-line/20 ${className}`}></div>
  }

  return (
    <img src={imgUrl || '/xray-image.png'} alt={alt} className={className} />
  )
}
