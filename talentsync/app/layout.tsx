import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Layout from "./components/Layout";

export const metadata: Metadata = {
  title: "TalentSync | Jobs, internships, and hiring",
  description:
    "Discover opportunities, apply with your profile, and manage your hiring with TalentSync.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
