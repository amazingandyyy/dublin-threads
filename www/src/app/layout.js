import Head from 'next/head'

import './globals.scss'

export const metadata = {
  title: 'DublinThreads',
  description: 'DublinThreads is proudly built by a community of civic-minded people living in Dublin, CA.'
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <Head>

      </Head>
      <body>
        {children}
      </body>
    </html>
  )
}
