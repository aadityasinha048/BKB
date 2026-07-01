import './globals.css';
import { Playfair_Display, Outfit } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Bihar Ka Bazaar — Authentic Products from Bihar',
  description: 'A Bindisa Agritech initiative. Shop GI-tagged and authentic products directly from Bihar farmers and artisans.',
  keywords: 'Bihar, GI Tag, Makhana, Madhubani, Bhagalpuri Silk, Shahi Litchi, Authentic Products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}