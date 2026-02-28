// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopCity - Premium Commerce',
  description: 'Simple. Fast. Reliable shopping experience.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#F8F9FB] text-[#1E293B]`}>
        {children} {/* page.tsx will be injected here */}
      </body>
    </html>
  )
}
