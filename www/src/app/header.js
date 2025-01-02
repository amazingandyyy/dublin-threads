import Link from 'next/link'
// import Hotjar from '@hotjar/browser'
//
// Hotjar.init(3595523, 6)
export default function GlobalHeader () {
  return (
    <header className="z-50 fixed top-0 left-0 right-0 px-4 py-3">
      <nav className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white/90 shadow-sm backdrop-blur-md py-2.5 px-4 rounded-2xl">
          <div className="flex items-center">
            <Link href="/" className="group">
              <h1 className="text-green-950 text-lg md:text-2xl tracking-tight font-bold group-hover:opacity-80 transition-opacity">
                Dublin<span className="font-normal italic">Threads</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Link href="/threads">
              <div className="px-3 md:px-4 py-1.5 text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200 flex items-center">
                <span className="px-1.5 py-0 text-[9px] font-semibold bg-teal-900 text-white rounded">
                  NEW
                </span>
                <span className="ml-1.5">Timeline</span>
              </div>
            </Link>
            <Link href="/explorer">
              <div className="px-3 md:px-4 py-1.5 text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200 flex items-center">
                <span className="px-1.5 py-0 text-[9px] font-semibold bg-teal-900 text-white rounded">
                  NEW
                </span>
                <span className="ml-1.5">Explorer</span>
              </div>
            </Link>
            {/* <Link href="/map">
              <div className="px-3 md:px-4 py-1.5 text-sm md:text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-800 transition-all duration-200">
                Map
              </div>
            </Link> */}
          </div>
        </div>
      </nav>
    </header>
  );
}
