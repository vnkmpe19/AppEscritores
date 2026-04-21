
import { Yeseva_One } from 'next/font/google';
import "./globals.css";
import TutorialProvider from '@/components/common/TutorialProvider';

const yeseva = Yeseva_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yeseva',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={yeseva.variable}>
      <body className="antialiased font-serif">
        <TutorialProvider>
          {children}
        </TutorialProvider>
      </body>
    </html>
  );
}