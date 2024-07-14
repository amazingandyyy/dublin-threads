import Link from 'next/link'
import { useEffect } from 'react'
import Hotjar from '@hotjar/browser'

export default function GlobalHeader () {
  useEffect(() => {
    Hotjar.init(3595523, 6)
  }, [])

  return (<header className='z-50 p-2 fixed top-0 text-center'>
    <div className="flex drop-shadow bg-white text-green-900 bg-opacity-30 py-2 px-2 md:py-4 md:px-6 backdrop-filter backdrop-blur rounded-full">
    <div className='flex'>
      <div className='flex items-center pl-2'>
      <Link href='/'>
        <h1 className="text-green-950 px-2 inline-block text-md md:text-2xl tracking-tighter font-bold hover:opacity-50 mr-2">
          Dublin<span className='font-light italic'>Thread</span>
        </h1>
        </Link>
      </div>
      {/* <div className='grow' /> */}
      <div className='flex items-center text-sm md:text-lg'>
        <Link href='/threads'>
          <div className='flex px-[5px] md:px-4 font-semibold hover:opacity-70'>
            All
          </div>
        </Link>
        <Link href='/threads?f=highlights'>
          <div className='flex px-[5px] md:px-4 font-semibold hover:opacity-70'>
            Photos
          </div>
        </Link>
        <Link href='/threads?f=meetings'>
          <div className='flex px-[5px] md:px-4 font-semibold hover:opacity-70'>
            Meetings
          </div>
        </Link>
        <Link href='/map'>
          <div className='flex px-[5px] md:px-4 font-semibold hover:opacity-70'>
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
