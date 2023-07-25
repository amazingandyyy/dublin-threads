import Image from 'next/image'
import Thread from './index'

export default function Threads ({ params, searchParams }) {
  return (
    <div>
      <header className="z-50 drop-shadow bg-white bg-opacity-80 fixed py-4 px-2 md:px-6 xl:px-24 top-0 left-0 right-0 backdrop-filter backdrop-blur">
      <div className='flex'>
        <div className='flex'>
          <Image
            src="/logos/dublin-threads-app-logo-dark.svg"
            alt="Dublin Threads app logo dark"
            className='inline-block mr-2 rounded-md'
            width={32}
            height={32}
            priority
          />
          <a href='/'>
            <h1 className="inline-block text-2xl tracking-tighter font-bold text-green-950">Dublin Threads</h1>
          </a>
        </div>
        <div className='grow'>
        </div>
        <div className='flex items-center'>
          {/* <Link href='/threads'>
          <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
            Threads
          </div>
          </Link> */}
          {/* <Link href='/map'>
          <div className='flex px-2 md:px-4 font-semibold text-green-950 hover:text-green-500'>
            Map
          </div>
          </Link> */}
          <div className='flex px-2'>
          <a target='_blank' href='https://github.com/amazingandyyy/dublin' className='opacity-40 flex hover:opacity-60' rel="noreferrer">
            <Image
              src="/images/github-icon.svg"
              alt="Dublin CA Green Logo"
              className='inline-block'
              width={24}
              height={24}
              priority
            />
          </a>
          </div>
        </div>
      </div>
    </header>
    <main className="flex bg-[#F3F2EE] min-h-screen flex-col items-center justify-between pt-16">
      {/* <div className="-z-1 invisible md:visible md:fixed inset-0 bg-[url(/images/grid.svg)] bg-center]"></div> */}
        <Thread />
    </main>
    </div>
  )
}
