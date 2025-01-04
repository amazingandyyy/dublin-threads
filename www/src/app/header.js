import Link from 'next/link'
// import Hotjar from '@hotjar/browser'
//
// Hotjar.init(3595523, 6)
export default function GlobalHeader () {
  return (
    <>
      {/* <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white text-sm text-center py-1.5 z-50 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="font-medium">🎉 Happy New Year 2025! </span>
          <span className="hidden sm:inline">Thank you for being part of our journey in 2024. </span>
          <span className="text-white/90">Here&apos;s to another year of keeping Dublin informed! 🌟</span>
        </div>
      </div> */}
      <header className="z-50 fixed top-0 left-0 right-0">
        <nav className="w-full bg-white/60 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none">
          <div className="sm:max-w-7xl mx-auto sm:px-4 sm:py-2">
            <div className="flex items-center justify-between bg-transparent sm:bg-white/90 sm:backdrop-blur-3xl py-3 sm:py-2.5 px-4 sm:px-4 sm:rounded-2xl sm:shadow-sm">
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="group">
                  <h1 className="text-xl sm:text-lg md:text-2xl text-green-950 tracking-tight font-bold group-hover:opacity-80 transition-opacity">
                    Dublin<span className="font-normal italic">Threads</span>
                  </h1>
                </Link>
              </div>
              <div className="flex items-center gap-3 sm:gap-2 overflow-x-auto scrollbar-thin">
                <Link href="/threads">
                  <div className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm sm:text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200 flex items-center whitespace-nowrap">
                    Updates
                  </div>
                </Link>
                <Link href="/explorer">
                  <div className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm sm:text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200 flex items-center whitespace-nowrap">
                    Explorer
                  </div>
                </Link>
                <Link href="/about">
                  <div className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm sm:text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200 whitespace-nowrap">
                    About
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
