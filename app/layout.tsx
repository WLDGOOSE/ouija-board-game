import { Cinzel } from 'next/font/google'
import { RouteAnalytics } from './components/Analytics';
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Spirit Board - Interactive Ouija Game',
  description: 'A web-based Ouija game with chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cinzel.className}>
  <RouteAnalytics />{children}</body>
    </html>
  )
}