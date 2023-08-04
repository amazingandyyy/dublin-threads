'use client'

import Head from 'next/head'
import { useEffect } from 'react'
import { fetchDevelopments } from '@/utils'
import { useThreadStore } from '@/stores'
import Script from 'next/script'
import Hotjar from '@hotjar/browser'
import './globals.scss'
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
export default function RootLayout ({ children }) {
  useEffect(() => {
    Hotjar.init(3595523, 6)
  }, [])

  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log('fetching global', data)
        useThreadStore.getState().update(data)
      })
  }, [])
  return (
    <html lang="en">
        <Script strategy="afterInteractive" id="gh4-1" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
        <Script strategy="afterInteractive" id="gh4-2" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){
              dataLayer.push(arguments)
            }
            gtag('js', new Date());
  
            gtag('config', '${GA_TRACKING_ID}');
          `
        }} />
      <Head>
        {/* Google tag (gtag.js) */}
        <meta property="og:title" content="dublin threads" />
        <meta property="og:type" content="news" />
        <meta property="og:description" content="Get to know the thread of local updates of Dublin in California. Updated every 30 minutes." />
        <meta property="og:url" content="https://dublin.amazyyy.com" />
        <meta property="og:image" content="https://dublin.amazyyy.com/images/hero.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://dublin.amazyyy.com/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://dublin.amazyyy.com/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://dublin.amazyyy.com/icons/favicon-16x16.png" />
        <link rel="manifest" href="https://dublin.amazyyy.com/icons/site.webmanifest" />
        <link rel="mask-icon" href="https://dublin.amazyyy.com/icons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="https://dublin.amazyyy.com/icons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#0D8100" />
        <meta name="msapplication-config" content="https://dublin.amazyyy.com/icons/browserconfig.xml" />
        <meta name="theme-color" content="#0D8100" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  )
}
