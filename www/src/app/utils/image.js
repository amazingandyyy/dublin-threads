import { useState } from 'react'
import { useArchivedSource } from '@/utils'

export default function (opts) {
  const [src, setSrc] = useState(opts.src || '')
  const [level, setLevel] = useState(0)

  return (<img
    { ...opts }
    src={src}
    alt={opts.alt === '' ? '' : 'image is too old and no longer exists'}
    onError={() => {
      switch (level) {
        case 1:
          // if(src.includes('amazingandyyy')) console.log('archive not found', src, opts.src)
          setLevel(2)
          break
        default:
          setSrc(useArchivedSource(opts.src))
          setLevel(1)
      }
    }}
  />)
}
