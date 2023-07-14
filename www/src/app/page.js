import Image from 'next/image'
import Thread from './thread'

export default function Home () {
  return (
    <div className=''>
      <header className="z-50 fixed border-b-2 border-gray-100 p-4 px-6 top-0 left-0 right-0 backdrop-filter backdrop-blur-2xl backdrop-opacity-98">
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
          <h1 className="inline-block text-2xl tracking-tighter font-bold">Dublin Thread</h1>
        </div>
        {/* <div className='grow'>
        </div> */}
        {/* <div className='flex items-center'>
          <div className='flex p-2'>
          <a target='_blank' href='https://github.com/amazingandyyy/dublin' className='hover:opacity-50'>
          <Image
            src="/images/github-icon.svg"
            alt="Dublin CA Green Logo"
            className='inline-block mr-2'
            width={24}
            height={24}
            priority
          />
          </a>
          </div>
        </div> */}
      </div>
    </header>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute inset-0 bg-[url(/images/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Thread />
    </main>
    </div>
  )
}
