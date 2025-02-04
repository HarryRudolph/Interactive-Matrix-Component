import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Example App',
  description: 'Example app using 3D interactive matrix component',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
