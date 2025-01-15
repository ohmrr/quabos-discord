import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quabos',
  description: 'The entertainment Discord bot.',
  keywords: ['quabos', 'quabos discord', 'discord bot', 'markov discord bot'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
