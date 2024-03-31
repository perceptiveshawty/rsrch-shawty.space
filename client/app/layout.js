import './globals.css'
import { GoogleAnalytics } from "../components/GoogleAnalytics";

export const metadata = {
  metadataBase: new URL('http://www.rsrch-shawty.space'),
  title: 'rsrch-shawty',
  description: 'Stream of my favorite papers and links.',
  openGraph: {
    type: 'website',
    url: 'https://www.rsrch-shawty.space',
    site_name: 'rsrch-shawty',
    images: [
      {
        url: 'https://www.rsrch-shawty.space/thumbnail.png',
        alt: 'rsrch-shawty homepage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@perceptivshawty',
    title: 'rsrch-shawty',
    description: 'Stream of my favorite papers and links.',
    image: 'https://www.rsrch-shawty.space/thumbnail.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@perceptivshawty" />
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
