
import { Yeseva_One } from 'next/font/google';
import "./globals.css";

const yeseva = Yeseva_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yeseva',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={yeseva.variable}>
      <body className="antialiased font-serif">
        {children}
      </body>
    </html>
  );
}