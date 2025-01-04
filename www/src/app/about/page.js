import React from 'react'
import GlobalHeader from '../header'

export const metadata = {
  title: 'About Dublin Threads',
  description: 'The story and journey of Dublin Threads - Connecting and celebrating our vibrant Dublin, California community.'
}

export default function AboutPage () {
  return (
    <>
      <GlobalHeader />
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 pb-16 sm:pb-24 max-w-4xl mt-16 sm:mt-20">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white rounded-xl sm:rounded-2xl mb-10 sm:mb-16 p-6 sm:p-10 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-bold text-xl sm:text-2xl inline-block mb-3 sm:mb-4 bg-white/20 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
              🎉 A Fresh Start for 2025!
            </span>
            <p className="text-base sm:text-lg leading-relaxed">
              <span className="block mb-2">Finally found time during the holiday break to give Dublin Threads the update it deserves.</span>
              <span className="text-white/90 bg-black/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-block text-sm sm:text-base">
                Drop me a message using the chat button - I&apos;d love to hear your thoughts! 💬
              </span>
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-block mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-700 mb-4">Our Dublin Story</h1>
            <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From newcomers to community builders - our journey of falling in love with Dublin
          </p>
        </div>
        
        {/* Introduction Card */}
        <section className="mb-12 sm:mb-20 bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-green-100/50 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-800">Hello from Andy & Family 👋</h2>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            Hey there! I&apos;m Andy, a software engineer who found home in Dublin with my amazing wife 
            and our two playful cats. When we&apos;re not chasing our cats around the house, you&apos;ll probably 
            find us exploring Dublin&apos;s trails, looking for local board game nights (always eager to join!), 
            or planning our next picnic at one of Dublin&apos;s beautiful parks. We&apos;re big believers in 
            bringing people together - there&apos;s something magical about sharing stories over good food 
            in our city&apos;s green spaces.
          </p>
        </section>

        {/* Timeline Section */}
        <div className="relative">
          {/* Timeline line - only visible on md and up */}
          <div className="hidden md:block absolute left-[3.25rem] top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600 rounded-full"></div>

          {/* 2025 */}
          <div className="relative mb-8 sm:mb-16">
            <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-8">
              <div className="flex-none bg-gradient-to-r from-green-600 to-teal-500 text-white px-3 sm:px-4 py-1 rounded-full font-bold shadow-lg md:w-24 text-center text-sm sm:text-base">
                2025
              </div>
              <div className="flex-grow bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-green-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-green-800 flex items-center gap-3">
                  Dreams for 2025 <span className="text-lg sm:text-xl md:text-2xl">🚀</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 mb-6">
                  Looking ahead to 2025, we're dreaming bigger! Beyond just tracking developments, we want 
                  to help build real connections. Imagine community picnics where neighbors become friends, 
                  board game meetups where stories are shared, and group hikes exploring Dublin's beautiful 
                  trails together. We believe technology should bring people together in real life, not just 
                  online. Dublin Threads is our way of weaving those connections, one update at a time.
                </p>

                {/* New Features List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-800">New Features Roadmap</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        ✓ Done
                      </span>
                      <span className="text-gray-700">Revamping overall visual experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        ✓ Done
                      </span>
                      <span className="text-gray-700">New Explorer experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        ✓ Done
                      </span>
                      <span className="text-gray-700">Add News to project page</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Coming Soon
                      </span>
                      <span className="text-gray-700">Enable community members to share anonymously</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Coming Soon
                      </span>
                      <span className="text-gray-700">Enable community to create events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2024 */}
          <div className="relative mb-8 sm:mb-16">
            <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-8">
              <div className="flex-none bg-gradient-to-r from-green-600 to-teal-500 text-white px-3 sm:px-4 py-1 rounded-full font-bold shadow-lg md:w-24 text-center text-sm sm:text-base">
                2024
              </div>
              <div className="flex-grow bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-green-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-green-800 flex items-center gap-3">
                  Growing Together <span className="text-lg sm:text-xl md:text-2xl">🌟</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  2024 was incredible - watching Dublin Threads grow from a personal project into a community 
                  resource has been humbling. Over 10,000 visits and 50+ regular users later, each notification 
                  of someone new joining the conversation still brings a smile to my face. Your comments, 
                  suggestions, and the way you've shared this platform with neighbors have made all those 
                  late-night coding sessions worth it. During the holiday break, my wife kept bringing me coffee 
                  while I worked on this update (she's the real MVP!).
                </p>
              </div>
            </div>
          </div>

          {/* 2023 */}
          <div className="relative mb-8 sm:mb-16">
            <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-8">
              <div className="flex-none bg-gradient-to-r from-green-600 to-teal-500 text-white px-3 sm:px-4 py-1 rounded-full font-bold shadow-lg md:w-24 text-center text-sm sm:text-base">
                2023
              </div>
              <div className="flex-grow bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-green-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-green-800 flex items-center gap-3">
                  Why Dublin Threads <span className="text-lg sm:text-xl md:text-2xl">🌱</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  After buying our home here in 2023, I found myself constantly checking city websites and 
                  community forums, trying to stay in the loop about local developments. The information was 
                  there, but it wasn't always easy to find or follow. That's when the idea hit me - why 
                  not create something that makes it easier for all of us to stay connected with our city's 
                  growth? Dublin Threads started as a simple project but grew into something more meaningful: 
                  a digital gathering place for our community.
                </p>
              </div>
            </div>
          </div>

          {/* 2022 */}
          <div className="relative mb-8 sm:mb-16">
            <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-8">
              <div className="flex-none bg-gradient-to-r from-green-600 to-teal-500 text-white px-3 sm:px-4 py-1 rounded-full font-bold shadow-lg md:w-24 text-center text-sm sm:text-base">
                2022
              </div>
              <div className="flex-grow bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-green-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-green-800 flex items-center gap-3">
                  Finding Our Place <span className="text-lg sm:text-xl md:text-2xl">🌳</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  Moving to Dublin in 2022 was one of our best decisions. Those first walks through Emerald 
                  Glen Park, discovering hidden trails, and watching the sunset paint the hills in golden hues - 
                  we knew we'd found something special. The way the morning fog rolls over the hills, the 
                  friendly waves from neighbors, and those perfect spring days when wildflowers dot the 
                  hillsides... it all just felt right. We especially love how Dublin balances natural beauty 
                  with thoughtful development, keeping that small-town charm while growing responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-green-200 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-green-800 text-center flex items-center justify-center gap-3">
            Join Our Community <span className="text-lg sm:text-xl md:text-2xl">🤝</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 text-center max-w-2xl mx-auto">
            Whether you&apos;ve been here for decades or just moved in last week, you&apos;re part of what 
            makes Dublin special. We&apos;d love to hear your stories, your ideas, and your hopes for our 
            city. Let&apos;s make Dublin Threads not just a website, but a bridge that connects our 
            online community to real-world friendships. Together, we can make Dublin feel even more 
            like home.
          </p>
        </section>
      </div>
    </>
  )
} 
