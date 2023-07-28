'use client'
import GlobalHeader from '@/header'
import ProjectBento from './projectBento'

export default function Project ({ params }) {
  return (<>
    <GlobalHeader />
    <div className='flex items-center flex-col bg-[#F3F2EE] h-screen w-screen'>
      <main className="flex flex-col items-center  pt-16 md:p-4 md:pt-[82px] max-w-[1200px]">
        <div>
          <ProjectBento projectId={params.projectId} />
        </div>
      </main>
      </div>
    </>
  )
}
