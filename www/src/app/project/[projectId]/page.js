'use client'
import GlobalHeader from '@/header'
import ProjectBento from '././projectBento'

export default function Project ({ params }) {
  return (<div className='bg-[#F3F2EE]'>
    <GlobalHeader />
    <div className='flex items-center flex-col w-screen'>
      <main className="flex flex-col items-center pt-16 md:p-4 md:pt-[82px] max-w-[1400px]">
        <div>
          <ProjectBento projectId={params.projectId} />
        </div>
      </main>
      </div>
    </div>
  )
}
