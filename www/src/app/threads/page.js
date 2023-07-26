import Thread from './index'
import GlobalHeader from '../header'

export default function Threads ({ params, searchParams }) {
  return (
    <>
      <GlobalHeader />
      <main className="flex bg-[#F3F2EE] min-h-screen flex-col items-center justify-between pt-16">
      {/* <div className="-z-1 invisible md:visible md:fixed inset-0 bg-[url(/images/grid.svg)] bg-center]"></div> */}
        <Thread />
      </main>
    </>
  )
}
