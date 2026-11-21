import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Camera Undo",
  description:
    "Interactive map of AI traffic cameras across Kerala with 500+ camera locations.",
  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    title: "AI Camera Undo",
    description:
      "Explore AI traffic camera locations across Kerala.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
