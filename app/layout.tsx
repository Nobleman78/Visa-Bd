import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisaBD — Find Your Work Visa & Global Immigration Agency",
  description: "Fast-track legal employment visas, skilled worker permits, and permanent residency pathways across Asia, Middle East, Europe, Africa and Americas.",
  keywords: [
    "Work Visa", 
    "Japan SSW Visa", 
    "Germany Opportunity Card", 
    "UK Skilled Worker", 
    "UAE Green Visa", 
    "VisaBD", 
    "Immigration Agency", 
    "Track Work Visa"
  ],
  openGraph: {
    title: "VisaBD — Find Your Work Visa",
    description: "Legal employment visas, job search authorizations, and verified embassy document processing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
