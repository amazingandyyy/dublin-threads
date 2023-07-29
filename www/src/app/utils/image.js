import Image from 'next/image'
import { useState } from 'react'

export default function ({
  original, height, src, width, thumbnail, alt, style, className
}) {
  const [show, setShow] = useState(true)
  return (show && <Image
      src={original || src}
      alt={alt}
      width={width}
      height={height || 0}
      className={className}
      style={{ width: `${width}px` || '100%', height: 'auto', ...style, minWidth: width, maxWidth: width }}
      blurDataURL={thumbnail}
      onError={() => setShow(false)}
    />)
}
