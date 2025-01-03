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
      <div className="container mx-auto px-4 py-12 max-w-4xl mt-20">
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white rounded-xl mb-12 py-4 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-medium text-lg">🎉 A Fresh Start for 2025! </span>
            <p className="mt-2">
              <span>Finally found time during the holiday break to give Dublin Threads the update it deserves. </span>
              <span className="text-white/90">Drop me a message using the chat button - I&apos;d love to hear your thoughts! 💬</span>
            </p>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-green-700 text-center">Our Dublin Story</h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          From newcomers to community builders - our journey of falling in love with Dublin
        </p>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-800">Hello from Andy & Family 👋</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Hey there! I&apos;m Andy, a software engineer who found home in Dublin with my amazing wife 
            and our two playful cats. When we&apos;re not chasing our cats around the house, you&apos;ll probably 
            find us exploring Dublin&apos;s trails, looking for local board game nights (always eager to join!), 
            or planning our next picnic at one of Dublin&apos;s beautiful parks. We&apos;re big believers in 
            bringing people together - there&apos;s something magical about sharing stories over good food 
            in our city&apos;s green spaces.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-800">Finding Our Place 🌳</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Moving to Dublin in 2022 was one of our best decisions. Those first walks through Emerald 
            Glen Park, discovering hidden trails, and watching the sunset paint the hills in golden hues - 
            we knew we&apos;d found something special. The way the morning fog rolls over the hills, the 
            friendly waves from neighbors, and those perfect spring days when wildflowers dot the 
            hillsides... it all just felt right. We especially love how Dublin balances natural beauty 
            with thoughtful development, keeping that small-town charm while growing responsibly.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-800">Why Dublin Threads? 🌱</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            After buying our home here in 2023, I found myself constantly checking city websites and 
            community forums, trying to stay in the loop about local developments. The information was 
            there, but it wasn&apos;t always easy to find or follow. That&apos;s when the idea hit me - why 
            not create something that makes it easier for all of us to stay connected with our city&apos;s 
            growth? Dublin Threads started as a simple project but grew into something more meaningful: 
            a digital gathering place for our community.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-800">Growing Together in 2024 🌟</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            2024 was incredible - watching Dublin Threads grow from a personal project into a community 
            resource has been humbling. Over 10,000 visits and 50+ regular users later, each notification 
            of someone new joining the conversation still brings a smile to my face. Your comments, 
            suggestions, and the way you&apos;ve shared this platform with neighbors have made all those 
            late-night coding sessions worth it. During the holiday break, my wife kept bringing me coffee 
            while I worked on this update (she&apos;s the real MVP!).
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-800">Dreams for 2025 🚀</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Looking ahead to 2025, we&apos;re dreaming bigger! Beyond just tracking developments, we want 
            to help build real connections. Imagine community picnics where neighbors become friends, 
            board game meetups where stories are shared, and group hikes exploring Dublin&apos;s beautiful 
            trails together. We believe technology should bring people together in real life, not just 
            online. Dublin Threads is our way of weaving those connections, one update at a time.
          </p>
        </section>

        <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-sm border border-green-100">
          <h2 className="text-3xl font-semibold mb-6 text-green-800 text-center">Join Our Community 🤝</h2>
          <p className="text-lg leading-relaxed text-gray-700 text-center max-w-2xl mx-auto">
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