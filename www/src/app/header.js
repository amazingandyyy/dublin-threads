import Link from 'next/link'
import { useEffect } from 'react'
import Hotjar from '@hotjar/browser'

export default function GlobalHeader () {
  useEffect(() => {
    Hotjar.init(3595523, 6)
  }, [])

  return (<header className='z-50 p-2 fixed top-0 text-center'>
    <div className="flex drop-shadow bg-white bg-opacity-30 py-4 px-4 md:px-6 backdrop-filter backdrop-blur rounded-full">
    <div className='flex'>
      <div className='flex'>
        <a href='/' className='flex items-center pl-2'>
          <h1 className="inline-block text-xl md:text-2xl tracking-tighter font-bold text-green-950 hover:opacity-50 mr-2">DublinThread</h1>
        </a>
      </div>
      {/* <div className='grow' /> */}
      <div className='flex items-center text-lg'>
        <Link href='/threads'>
          <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
            All
          </div>
        </Link>
        <Link href='/threads?f=highlights'>
          <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
            Photos
          </div>
        </Link>
        <Link href='/threads?f=meetings'>
          <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
            Meetings
          </div>
        </Link>
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
  </div>
</header>)
}
