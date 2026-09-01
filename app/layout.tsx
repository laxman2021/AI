import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LakshmiN | Staff Engineer & AI Builder",
  description:
    "Portfolio of a Staff Engineer specializing in Drupal, React, Node.js, cloud engineering, enterprise modernization, and AI.",
  metadataBase: new URL("https://lakshm.in")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
