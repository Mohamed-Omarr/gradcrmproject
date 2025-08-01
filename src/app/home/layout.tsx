import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import { Suspense } from "react";
import Loader from "../Loader";
import Providers from "../shop/redux/Providers";
import { ToastContainer } from "react-toastify";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Suspense fallback={<Loader />}>
            <Providers>
              <Header />
              <main className="px-40">{children}</main>
              <Footer />
              <ToastContainer />
            </Providers>
        </Suspense>
      </body>
    </html>
  );
}
