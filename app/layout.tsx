import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans' });

export const metadata: Metadata = {
    title: "CalliX Enterprise",
    description: "Enterprise AI Platform",
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${dmSans.variable} font-sans antialiased overflow-hidden`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="ambient-bg">
                        <div className="liquid-shape shape-1"></div>
                        <div className="liquid-shape shape-2"></div>
                        <div className="liquid-shape shape-3"></div>
                    </div>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
