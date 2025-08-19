import { Dela_Gothic_One, Montserrat } from "next/font/google";

const dela_gothic_one = Dela_Gothic_One({
  variable: "--font-dela-gothic-one",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dela_gothic_one.variable} ${montserrat.variable} antialiased scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
