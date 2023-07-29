import Thread from './index'
import GlobalHeader from '../header'
import Image from "next/image";
import {useThreadStore} from "@/stores";

export default function Threads () {
  const thread = useThreadStore(state => state.thread)
  return (
    <>
      <GlobalHeader />
      <main className="flex min-h-screen flex-col items-center justify-between pt-16">
        <div className='flex flex-col py-4'>
          <div className='flex flex-col items-center text-center text-gray-600 p-4'>
            <Image
              src="/logos/dublin-threads-app-logo-light.svg"
              alt="Dublin CA Green Logo"
              className='inline-block mr-2 mb-4 rounded-2xl shadow-[0_20px_60px_-5px_rgba(0,0,0,0.3)] bg-white'
              width={68}
              height={68}
              priority
            />
            <div className='text-3xl md:text-5xl font-bold text-green-950 mb-4'>
              A Thread for Dublin
            </div>
            <div>
              This is a thread of {'what\'s'} happening on <a className='text-green-600' href='https://dublin-development.icitywork.com' target='_blank' rel="noreferrer">Dublin Devlopment Projects Site</a>
            </div>
            <div>
              Updated every 30 minutes
            </div>
          </div>
        <Thread thread={thread} />
        </div>
      </main>
    </>
  )
}
