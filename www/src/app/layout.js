import './globals.scss'

export const metadata = {
  title: 'DublinThread',
  description: 'DublinThread is a community of civic-minded people in Dublin, CA.'
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
