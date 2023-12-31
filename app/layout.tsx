import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import AuthProvider from "./api/context/AuthProvider";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decentralized Bureau of Investigation",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Providers>
          <AuthProvider>
            <main className="min-h-screen h-full flex flex-col justify-between items-center bg-neutral-900">
              <Header />
              {children}
              <Footer />
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
