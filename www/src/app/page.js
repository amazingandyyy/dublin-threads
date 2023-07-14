import Image from 'next/image'
import Thread from './thread'
import Link from 'next/link';

export default function Home () {
  return (
    <div>
      <header className="z-50 drop-shadow bg-white bg-opacity-80 fixed p-4 px-6 top-0 left-0 right-0 backdrop-filter backdrop-blur">
      <div className='flex'>
        <div className='flex'>
          <Image
            src="/images/dublin-green.svg"
            alt="Dublin CA Green Logo"
            className='inline-block mr-2'
            width={32}
            height={32}
            priority
          />
          <Link href='/'>
          <h1 className="inline-block text-2xl tracking-tighter font-bold text-green-950">Dublin Thread</h1>
          </Link>
        </div>
        <div className='grow'>
        </div>
        <div className='flex items-center'>
          <Link href='/'>
          <div className='flex px-4 font-semibold text-green-950 hover:text-green-500'>
            Thread
          </div>
          </Link>
          <Link href='/map'>
          <div className='flex px-4 font-semibold text-green-950 hover:text-green-500'>
            Map
          </div>
          </Link>
          <div className='flex px-2'>
          <a target='_blank' href='https://github.com/amazingandyyy/dublin' className='opacity-40 flex hover:opacity-60'>
            <Image
              src="/images/github-icon.svg"
              alt="Dublin CA Green Logo"
              className='inline-block'
              width={20}
              height={20}
              priority
            />
          </a>
          </div>
        </div>
      </div>
    </header>
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="fixed inset-0 bg-[url(/images/grid.svg)] bg-center]"></div>
        <Thread />
    </main>
    </div>
  )
}
