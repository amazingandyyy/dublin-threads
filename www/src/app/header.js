import Link from 'next/link'
import { useEffect } from 'react'
import Hotjar from '@hotjar/browser'

export default function GlobalHeader () {
  useEffect(() => {
    Hotjar.init(3595523, 6)
  }, [])

  return (<header className="z-50 drop-shadow bg-white bg-opacity-90 fixed py-4 px-2 md:px-6 xl:px-24 top-0 left-0 right-0 backdrop-filter backdrop-blur">
  <div className='flex'>
    <div className='flex'>
      <a href='/' className='flex items-center pl-2'>
        <h1 className="inline-block text-xl md:text-2xl tracking-tighter font-bold text-green-950 hover:opacity-80">🍀 Dublin Threads</h1>
      </a>
    </div>
    <div className='grow'>
    </div>
    <div className='flex items-center'>
      <Link href='/threads'>
      <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
        Projects
      </div>
      </Link>
      <Link href='/threads?f=meetings'>
        <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
          Meetings
        </div>
      </Link>
      {/* <Link href='/stats'> */}
      {/*  <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'> */}
      {/*    Stats */}
      {/*  </div> */}
      {/* </Link> */}
      <Link href='/map'>
      <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
        Map
      </div>
      </Link>
      <div className='flex sm:px-1 md:px-2'>
      {/* <a target='_blank' href='https://github.com/amazingandyyy/dublin' className='opacity-40 flex hover:opacity-60' rel="noreferrer">
        <Image
          src="/images/github-icon.svg"
          alt="Dublin CA Green Logo"
          className='inline-block'
          width={24}
          height={24}
          priority
        />
      </a> */}
      </div>
    </div>
  </div>
</header>)
}
