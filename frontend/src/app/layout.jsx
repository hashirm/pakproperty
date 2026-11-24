import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'PakProperty | Pakistan’s Premier Real Estate Marketplace',
  description:
    'Search verified houses, plots, flats, and commercial properties for sale and rent across Islamabad, Lahore, Karachi, Rawalpindi, and all major cities in Pakistan.',
  keywords: [
    'real estate pakistan',
    'zameen',
    'houses for sale in islamabad',
    'dha lahore plots',
    'flats in clifton karachi',
    'property in bahria town',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
