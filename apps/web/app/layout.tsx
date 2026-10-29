import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://secloudive.com';
const description =
  'Practical AWS security learning through foundations, missions, and evidence. Build the judgment to secure cloud systems.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Secloudive | Practical AWS security learning',
    template: '%s | Secloudive',
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Secloudive',
    title: 'Secloudive | Practical AWS security learning',
    description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Secloudive' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secloudive | Practical AWS security learning',
    description,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
