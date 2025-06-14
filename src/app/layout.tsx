import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Calendário de Vacinação Infantil',
    description: 'Acompanhe o calendário de vacinação do seu bebê de forma fácil e organizada',
    keywords: 'vacinação, bebê, calendário, saúde infantil, imunização',
    authors: [{ name: 'Calendário Vacinação' }],
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#3b82f6',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#3b82f6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Vacinação" />
            </head>
            <body className={inter.className}>
                <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {children}
                </main>
            </body>
        </html>
    )
}