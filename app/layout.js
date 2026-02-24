import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata = {
  title: "البشت العربي الأصيل",
  description:
    "متجر متخصص بالبشوت الخليجية الفاخرة بتصاميم كلاسيكية وشحن إلى دول الخليج",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.variable} bg-brand-soft text-brand-brown antialiased`}
      >
        <UserProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-brand-soft">
              <Navbar />
              <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
