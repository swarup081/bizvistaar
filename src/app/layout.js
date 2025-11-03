import {
  Inter,
  Playfair_Display,
  Roboto,
  Lato,
  Montserrat,
  Poppins
} from "next/font/google";
import "./globals.css";

// --- FONT DEFINITIONS ---
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: 'swap' });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });

const playfair = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"], display: 'swap' });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: 'swap' });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });
// --- END FONT DEFINITIONS ---

export const metadata = {
  title: "BizVistar",
  description: "Empowering Local Businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${roboto.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}