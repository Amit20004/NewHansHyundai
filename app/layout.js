import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BTTButton from "./components/BTTButton";
import "./lenis/Lenis";
import ScrollWrapper from "./components/scolling/ScrollWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hans Hyundai",
  description: "Hans Hyundai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ScrollWrapper>
          {children}
          <BTTButton />
        </ScrollWrapper>
      </body>
    </html>
  );
}
