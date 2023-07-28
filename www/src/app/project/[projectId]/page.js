'use client'
import GlobalHeader from '@/header'
import ProjectDetails from './projectDetails'

export default function Project ({ params }) {
  return (<>
    <GlobalHeader />
    <main className="flex flex-col items-center bg-white h-screen w-screen pt-16 md:p-4 md:pt-[82px]">
      <div>
        <ProjectDetails projectId={params.projectId} />
      </div>
    </main>
    </>
  )
}
