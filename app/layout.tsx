import type { Metadata, Viewport } from 'next';
import { Cinzel } from 'next/font/google';
import { Analytics } from './components/Analytics';
import BackgroundAudio from './components/BackgroundAudio';
import './globals.css';

const cinzel = Cinzel({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  title: {
    default: 'Spirit Board - Interactive Ouija Experience',
    template: '%s | Spirit Board'
  },
  description: 'A mystical web-based Ouija experience with spiritual guidance and ancient wisdom. Connect with the other side through our interactive spirit board.',
  keywords: ['ouija', 'spirit board', 'mystical', 'spiritual', 'interactive', 'game'],
  authors: [{ name: 'Spirit Board Team' }],
  creator: 'Spirit Board',
  publisher: 'Spirit Board',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ouijia-board.netlify.app/'), // Replace with your actual domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ouijia-board.netlify.app/',
    title: 'Spirit Board - Interactive Ouija Experience',
    description: 'Connect with the other side through our interactive spirit board.',
    siteName: 'Spirit Board',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spirit Board - Interactive Ouija Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spirit Board - Interactive Ouija Experience',
    description: 'Connect with the other side through our interactive spirit board.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cinzel.variable}>
      <head>
        <Analytics />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={cinzel.className}>
        {children}
        <BackgroundAudio />
      </body>
    </html>
  );
}