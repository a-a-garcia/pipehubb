import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { Container, Theme } from "@radix-ui/themes";
import ReactQueryClientProvider from "./api/ReactQueryProviderClient";

const roboto_flex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  title: "PipeHubb",
  description:
    "Landing page for PipeHubb, sales pipeline software designed specifically with the loan officer team in mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto_flex.variable}>
        <ReactQueryClientProvider>
          <Theme accentColor="ruby">
            <NavBar />
            <main className="p-5">
              <Container>{children}</Container>
            </main> 
          </Theme>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
