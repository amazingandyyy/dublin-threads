import Image from 'next/image'
import { useState } from 'react'

export default function({
  original, width, thumbnail, alt, style, className
}) {
  const [src, setSrc] = useState(original)
  return (<Image 
      src={src}
      alt={alt}
      width={parseInt(width.replace('px', ''))}
      height={0}
      className={className}
      style={{ width: '100%', height: 'auto', ...style, minWidth: width, maxWidth: width, width: width,  }}
      blurDataURL={thumbnail}
      onError={() => setSrc('/images/beams.jpg')}
    />)
}