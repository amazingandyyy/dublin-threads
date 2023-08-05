import Head from 'next/head'

import Script from 'next/script'
import Hotjar from '@hotjar/browser'
import './globals.scss'
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

export const metadata = {
  metadataBase: new URL('https://dublin.amazyyy.com'),
  alternates: {
    'shortcut icon': '/icons/favicon.ico',
    'mask-icon': {
      href: '/icons/safari-pinned-tab.svg',
      color: '#2AA34A'
    },
    manifest: '/icons/site.webmanifest'
  },
  openGraph: {
    title: 'Dublin Threads',
    description: 'Built by a software engineer living in Dublin, CA. Dublin threads is a place for local updates on developments and public meetings. Updated every 30 minutes.',
    url: 'https://dublin.amazyyy.com',
    siteName: 'DublinThreads',
    themeColor: '#2AA34A',
    images: [
      {
        url: '/images/hero.png',
        width: 1148,
        height: 437
      }
    ],
    locale: 'en_US'
  }
}

Hotjar.init(3595523, 6)

export default function RootLayout ({ children }) {
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
        <Script strategy="afterInteractive" id="crisp-1" dangerouslySetInnerHTML={{
          __html: `
            window.$crisp=[];window.CRISP_WEBSITE_ID="${CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
          `
        }} />

      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="https://dublin.amazyyy.com/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://dublin.amazyyy.com/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://dublin.amazyyy.com/icons/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#0D8100" />
        <meta name="msapplication-config" content="https://dublin.amazyyy.com/icons/browserconfig.xml" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  )
}
