import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ProbEdge — Best Bets Daily",
  description: "Daily best bets from Polymarket: sports props, moneylines, underdogs & high-probability plays",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ProbEdge — Best Bets Daily",
    description: "Daily best bets from Polymarket across all sports",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
