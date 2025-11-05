
import "@/lib/server-polyfills"; // Import server-side polyfills
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import fs from "fs";
import path from "path";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const version = fs.readFileSync(path.join(process.cwd(), "VERSION"), "utf8").trim();
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  const appName = packageJson.name;

  return {
    title: `${appName} v${version}`,
    description: "My portfolio",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const version = fs.readFileSync(path.join(process.cwd(), "VERSION"), "utf8").trim();
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  const appName = packageJson.name;
  const repoUrl = packageJson.repository ? packageJson.repository.url.replace(/\.git$/, '') : '';
  const appProdUrl = "https://portfolio-app-272932496670.europe-west1.run.app/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
        suppressHydrationWarning
      >
        <nav className="bg-black p-2">
          <div className="container mx-auto flex justify-between">
            <div className="flex space-x-4">
              <Link href="/" className="text-yellow-400 hover:text-yellow-300">
                Talks
              </Link>
              <Link href="/articles" className="text-yellow-400 hover:text-yellow-300">
                Articles
              </Link>
              <Link href="/about" className="text-yellow-400 hover:text-yellow-300">
                About Me
              </Link>
              <Link href="/next-talks" className="text-yellow-400 hover:text-yellow-300">
                Next Talks
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <Footer appName={appName} version={version} repoUrl={repoUrl} appProdUrl={appProdUrl} />
      </body>
    </html>
  );
}
