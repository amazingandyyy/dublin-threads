'use client'

import GlobalHeader from '../header'
import StatsBento from './statsBento'

export default function Threads () {
  return (<>
		<GlobalHeader />
		<main className="pt-16 bg-[#F3F2EE] h-screen">
		<StatsBento />
		</main>
  </>)
}
